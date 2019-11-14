class BioBlocksFrameAPI {
  constructor() {
    console.log('({{hiddenInstantiationId}}) constructing BioBlocksFrameAPI');
    this.appId = '{{appId}}';
    this.hiddenInstantiationId = '{{hiddenInstantiationId}}';
    this.sharedCommunicationSecret = '{{sharedCommunicationSecret}}';

    //setup RSA encryption
    this.rsaEncryptor = new JSEncrypt();
    this.rsaDecryptor = new JSEncrypt();
    this.rsaEncryptor.setPublicKey(this.hex2ascii('{{parentPublicKey}}'));
    this.rsaDecryptor.setPrivateKey(this.hex2ascii('{{framePrivateKey}}'));

    //setup postMessage listeners
    this.setupPMListener();

    //
    // attempt handshake with parent
    // - verify parent is available
    // - verify parent can encrypt / decrypt messages with server-provided keys
    //
    this.callFn('initialize', { 'my test key': 'has a value!!' }).then(
      response => {
        //initialization succeeded
        console.log('({{hiddenInstantiationId}}) initialization succeeded', response);
      },
      err => {
        //initialization failed
        console.error('({{hiddenInstantiationId}}) communication with bioblocks failed', err);
        delete this.rsaEncryptor;
        delete this.rsaDecryptor;
      },
    );
  }

  //
  //
  // MAIN FUNCTIONS EXPOSED TO APP
  //
  //
  addDataUpdatedListener(fn) {
    if (!this.dataUpdatedListeners) {
      this.dataUpdatedListeners = [];
    }
    this.dataUpdatedListeners.append(fn);
  }

  //
  //
  // PRIVATE
  //
  //

  /**
   * setupPMListener: This function will coordinate all incoming message events. It
   *                   will respond to [1] postMessages that are in response to api calls
   *                   (i.e., the messageId is in this singleton's messageId->promise
   *                   hashmap), and [2] postMessages that target this instantiation.
   *                   In addition, this function will validate all messages and dispatch
   *                   them appropriately.
   */
  setupPMListener() {
    //setup system for monitoring postMessages and resolving/rejecting promises
    this.messagePromises = {};

    //setup single async message listener
    window.addEventListener('message', e => {
      console.log('({{hiddenInstantiationId}}) message received in iframe:', e);

      //is this message aimed at this instantiation
      if (
        // e.origin === '{{config["BB_ORIGIN"]}}' &&
        e.data &&
        e.data.targetInstantiationId === this.hiddenInstantiationId
      ) {
        //decrypt step 1: decrypt aes key
        const aesDecryptionKey = aesjs.utils.hex.toBytes(this.rsaDecryptor.decrypt(e.data.key));

        //decrypt step 2: decrypt the aes encrypted payload
        let aesCtr = new aesjs.ModeOfOperation.ctr(aesDecryptionKey);
        const payload = JSON.parse(aesjs.utils.utf8.fromBytes(aesCtr.decrypt(aesjs.utils.hex.toBytes(e.data.payload))));

        console.log('({{hiddenInstantiationId}}) instantiation received payload:', payload);
        if (payload.sharedCommunicationSecret !== this.sharedCommunicationSecret) {
          console.error(
            '({{hiddenInstantiationId}}) Invalid communication attempt from parent. Communication secrets do not match:',
          );
          console.error(` - parent sharedCommunicationSecret = ${payload.sharedCommunicationSecret}`);
          console.error(` - iFrame sharedCommunicationSecret = ${this.sharedCommunicationSecret}`);
          return;
        }

        if (e.data.messageId && this.messagePromises[e.data.messageId]) {
          //parent is responding to one of our previous requests
          const promise = this.messagePromises[e.data.messageId];
          delete this.messagePromises[e.data.messageId];

          if (payload.responseError) {
            promise.reject('postMessage error: parent returned error:', payload.responseError.errorDesc);
            return;
          } else {
            console.log('({{hiddenInstantiationId}}) promise:', promise);
            promise.resolve(payload.successData);
            return;
          }
        } else {
          //parent is initiating a new request
          console.log('({{hiddenInstantiationId}}) parent appears to be initiating a new request');
        }
      } else {
        console.log(
          '({{hiddenInstantiationId}}) postMessage detected not targeted at this instantiation',
          this.instantiationId,
        );
      }
    });
  }

  /**
   * callFn: call a function through postMessage. returns a promise that will
   *          resolve with the parent response or raise an error.
   */
  callFn(fn, payload) {
    //generate a unique message id, populate and encrypt data, execute postMessage call
    const messageId = this.uuid();
    const unencryptedPayloadObj = Object.assign(
      {
        fn: fn,
        sharedCommunicationSecret: this.sharedCommunicationSecret,
      },
      payload,
    );

    const rsaEncryptor = this.rsaEncryptor;
    const hiddenInstantiationId = this.hiddenInstantiationId;

    let promiseResolve;
    let promiseReject;
    const promise = new Promise((resolve, reject) => {
      const cryptoObj = window.crypto || window.msCrypto;
      const aesKeyBytes = cryptoObj.getRandomValues(new Uint8Array(16)); // 16 digits = 128 bit key
      const aesCtr = new aesjs.ModeOfOperation.ctr(aesKeyBytes);

      //console.log('sending message '+messageId+' to window ', window.parent);
      window.parent.postMessage(
        {
          instantiationId: hiddenInstantiationId,
          key: rsaEncryptor.encrypt(aesjs.utils.hex.fromBytes(aesKeyBytes)),
          messageId: messageId,
          payload: aesjs.utils.hex.fromBytes(
            //convert encrypted bytes to hex for postMessage
            aesCtr.encrypt(
              //AES encrypt the object bytes
              aesjs.utils.utf8.toBytes(
                //convert object string to bytes
                JSON.stringify(unencryptedPayloadObj),
              ),
            ),
          ),
        },
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
   * hex2ascii: convert a string that contains hex into ASCII
   */
  hex2ascii(hex = '') {
    let str = '';
    for (let i = 0; i < hex.length; i += 2) {
      str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    return str;
  }

  /**
   * uuid: generate random UUID
   */
  uuid() {
    function _p8(s) {
      const p = (Math.random().toString(16) + '000000000').substr(2, 8);
      return s ? '-' + p.substr(0, 4) + '-' + p.substr(4, 4) : p;
    }
    return _p8() + _p8(true) + _p8(true) + _p8();
  }
}

export const bbAPI = new BioBlocksFrameAPI();
