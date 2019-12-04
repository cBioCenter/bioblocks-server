/// <reference path="../index.d.ts" />

import { BioblocksMessenger } from '/js/bioblocks-api/BioblocksMessenger.js';

/**
 * Lives inside a sandboxed iframe.
 *
 * !!Important!!
 * ! communicator.py injects variables into double curly brackets, e.g. {{hiddenInstantiationId}}.
 */
class BioblocksFrameTemplate {
  constructor() {
    this.appId = '{{appId}}';
    this.hiddenInstantiationId = '{{hiddenInstantiationId}}';
    this.instantiationId = '{{instantiationId}}';
    this.sharedCommunicationSecret = '{{sharedCommunicationSecret}}';

    console.log(
      `Constructing BioblocksFrame.
      hiddenInstantiationId='${this.hiddenInstantiationId}'
      instantiationId='${this.instantiationId}'`,
    );

    /**
     * System for monitoring postMessages and resolving/rejecting promises.
     * @type IMessagePromiseMap
     */
    this.messagePromises = {};
    this.bioblocksMessenger = new BioblocksMessenger();

    // Setup RSA encryption.
    this.rsaEncryptor = new JSEncrypt();
    this.rsaDecryptor = new JSEncrypt();
    this.rsaEncryptor.setPublicKey(BioblocksMessenger.hex2ascii('{{parentPublicKey}}'));
    this.rsaDecryptor.setPrivateKey(BioblocksMessenger.hex2ascii('{{framePrivateKey}}'));

    // Setup postMessage listeners.
    this.setupPMListener();

    // Attempt handshake with parent:
    // - verify parent is available.
    // - verify parent can encrypt / decrypt messages with server-provided keys.
    this.callFn('initialize', { 'my test key': 'has a value!!' }).then(
      response => {
        // Initialization succeeded.
        console.log(`Bioblocks Frame (${this.hiddenInstantiationId}) initialization succeeded`);
        this.bioblocksMessenger.dispatchPostMessage(
          window.parent,
          this.rsaEncryptor,
          BioblocksMessenger.generateNewUUID(),
          this.hiddenInstantiationId,
          {
            sharedCommunicationSecret: this.sharedCommunicationSecret,
          },
          '*',
        );
      },
      err => {
        // Initialization failed.
        console.error(`Bioblocks Frame (${this.hiddenInstantiationId}) communication with bioblocks failed`, err);
        delete this.rsaEncryptor;
        delete this.rsaDecryptor;
      },
    );
    this.messagePromises[Object.keys(this.messagePromises)[0]].resolve();
    // window.addEventListener('load', this.onDocumentLoad);
  }

  /**
   * @param {Event} e
   */
  onDocumentLoad = e => {
    const promiseKeys = Object.keys(this.messagePromises);
    if (promiseKeys.length !== 1) {
      console.log(
        `Bioblocks Frame (${this.hiddenInstantiationId}) doc loaded with invalid initial promise length '${promiseKeys.length}'`,
      );
    } else {
      setTimeout(() => this.messagePromises[promiseKeys[0]].resolve(), 5000);
    }
  };

  /**
   * Main function exposed to app.
   *
   * @param {*} fn
   * @memberof BioblocksFrameTemplate
   */
  addDataUpdatedListener(fn) {
    if (!this.dataUpdatedListeners) {
      this.dataUpdatedListeners = new Array();
    }
    this.dataUpdatedListeners.push(fn);
  }

  //
  // PRIVATE
  //

  /**
   * setupPMListener: This function will coordinate all incoming message events. It
   *                    will respond to [1] postMessages that are in response to api calls
   *                    (i.e., the messageId is in this singleton's messageId->promise
   *                    hashmap), and [2] postMessages that target this instantiation.
   *                    In addition, this function will validate all messages and dispatch
   *                    them appropriately.
   */
  setupPMListener() {
    this.messagePromises = {};

    // Setup single async message listener.
    window.addEventListener('message', this.onMessage);
  }

  /**
   * @param {*} fn A function to be executed through postMessage.
   * @param {*} payload Payload to be sent to the parent.
   * @returns A promise that will resolve with the parent's response or raise an error.
   */
  callFn(fn, payload) {
    // Generate a unique message id, populate and encrypt data, execute postMessage call.
    const messageId = BioblocksMessenger.generateNewUUID();
    const unencryptedPayloadObj = Object.assign(
      {
        fn: fn,
        sharedCommunicationSecret: this.sharedCommunicationSecret,
      },
      payload,
    );

    const rsaEncryptor = this.rsaEncryptor;
    const hiddenInstantiationId = this.hiddenInstantiationId;

    let promiseResolve = () => console.log('empty resolve');
    let promiseReject = () => console.log('empty reject');
    const promise = new Promise((resolve, reject) => {
      this.bioblocksMessenger.dispatchPostMessage(
        window.parent,
        rsaEncryptor,
        messageId,
        hiddenInstantiationId,
        unencryptedPayloadObj,
        '{{config["BB_ORIGIN"]}}',
      );

      promiseResolve = resolve;
      promiseReject = reject;
    });

    this.messagePromises[messageId] = {
      promise: promise,
      reject: promiseReject,
      resolve: promiseResolve,
    };
    return promise;
  }

  /**
   * @param {IBioblocksBrokerMessageEvent} e
   */
  onMessage = e => {
    console.log(`Bioblocks Frame (${this.hiddenInstantiationId}) message received in iframe:`, e);

    /** @type IBioblocksResponse */
    const data = e.data;
    // Is this message aimed at this instantiation?
    if (
      // e.origin === '{{config["BB_ORIGIN"]}}' &&
      data &&
      data.targetInstantiationId === this.hiddenInstantiationId
    ) {
      e.stopImmediatePropagation();
      // Decrypt step 1: decrypt aes key.
      const payloadDecryptionKey = aesjs.utils.hex.toBytes(this.rsaDecryptor.decrypt(data.key));

      // Decrypt step 2: decrypt the aes encrypted payload.
      let aesCtr = new aesjs.ModeOfOperation.ctr(payloadDecryptionKey);
      const payload = JSON.parse(aesjs.utils.utf8.fromBytes(aesCtr.decrypt(aesjs.utils.hex.toBytes(data.payload))));

      console.log(`Bioblocks Frame (${this.hiddenInstantiationId}) instantiation received payload:`, payload);
      if (payload.sharedCommunicationSecret !== this.sharedCommunicationSecret) {
        console.error(
          `Bioblocks Frame (${this.hiddenInstantiationId}) Invalid communication attempt from parent. Shared secrets do not match:`,
        );
        console.error(` - parent sharedCommunicationSecret = ${payload.sharedCommunicationSecret}`);
        console.error(` - iFrame sharedCommunicationSecret = ${this.sharedCommunicationSecret}`);
        return;
      }

      if (data.messageId && this.messagePromises[data.messageId]) {
        // Broker is responding to one of our previous requests.
        const promise = this.messagePromises[data.messageId];
        delete this.messagePromises[data.messageId];

        if (payload.responseError) {
          promise.reject('postMessage error: Broker returned error:', payload.responseError.errorDesc);
          return;
        } else {
          console.log(`Bioblocks Frame (${this.hiddenInstantiationId}) promise:`, promise);
          promise.resolve(payload.successData);
          return;
        }
      } else {
        console.log(`Bioblocks Frame (${this.hiddenInstantiationId}): Broker appears to be initiating a new request`);
        window.dispatchEvent(
          new MessageEvent('bb-message', {
            data: payload.successData,
          }),
        );
      }
    } else {
      console.log(
        `Bioblocks Frame (${this.hiddenInstantiationId}) postMessage detected not targeted at this instantiation`,
        this.instantiationId,
      );
    }
  };
}

const BioblocksFrameInstance = new BioblocksFrameTemplate();

export default BioblocksFrameInstance;
