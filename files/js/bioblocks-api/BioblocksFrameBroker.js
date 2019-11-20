/// <reference path="../../../index.d.ts" />

import { BioblocksMessenger } from '/js/bioblocks-api/BioblocksMessenger.js';

/**
 * Handles interactions between BioblocksFrames.
 *
 * @class BioblocksFrameBroker
 */
class BioblocksFrameBroker {
  constructor() {
    /** @type InstantiationMap */
    this.instantiations = {};
    this.bioblocksMessenger = new BioblocksMessenger();
  }

  /**
   * Creates a new instantiation of a given app.
   *
   * @param {string} appId ID of app to instantiate a new iFrame for.
   * @memberof BioblocksFrameBroker
   */
  addInstantiationFrameForApp(appId) {
    // Post to bioblocks.org.
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://0.0.0.0:11037/instantiation', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({ appId: appId }));

    xhr.onload = () => {
      /** @type IBioblocksData */
      const data = JSON.parse(xhr.responseText);
      console.log('(broker) Instantiation processed by server with response.', data);

      // Listen for the new apps messages.
      this.instantiations[data.instantiationId] = {
        framePublicKey: data.framePublicKey,
        hiddenInstantiationId: data.hiddenInstantiationId,
        instantiationId: data.instantiationId,
        outgoingMessages: [],
        parentPrivateKey: data.parentPrivateKey,
        rsaDecryptor: new JSEncrypt(),
        rsaEncryptor: new JSEncrypt(),
        sharedCommunicationSecret: data.sharedCommunicationSecret,
      };

      this.instantiations[data.instantiationId].rsaEncryptor.setPublicKey(
        BioblocksMessenger.hex2ascii(data.framePublicKey),
      );
      this.instantiations[data.instantiationId].rsaDecryptor.setPrivateKey(
        BioblocksMessenger.hex2ascii(data.parentPrivateKey),
      );

      /**
       *  Listen for, and respond to, messages sent from BioblocksFrame(s).
       *  Messages take the form:
       *  {
       *    key:           RSA encrypted AES key
       *    messageId:     Unique id for this call - used to inform response
       *    payload:       AES encrypted payload in hex. Takes the form:
       *    {
       *      sharedCommunicationSecret: A secret key provided by the server that only
       *                                   the frame is aware of.
       *      fn:                        Function to execute. See below.
       *      params:                    An object that contains key value pairs for
       *                                   the function. See below.
       *    }
       *  }
       *
       *  Valid fn and params values:
       *    fn                params                    successData in returned payload
       *    --                ------                    --------------------------------
       *    init              null | {}                 {}
       *    getObject         { objId: uuid }           { objId: uuid, obj: byte[] }
       *
       *  Responses take the form:
       *  {
       *    messageId:               The same id passed in the requesting message.
       *    targetInstantiationId:   UUID unique for the instantiation (sever provided)
       *    key:                     RSA encrypted AES key
       *    payload:                 AES encrypted payload in hex. Takes the form:
       *    {
       *      sharedCommunicationSecret: A secret key provided by the server that only
       *                                   the frame is aware of.
       *      responseError:             If 'responseError' is set then 'successData'
       *                                   will not be set and the value of 'responseError'
       *                                   will contain an object like:
       *      {
       *        errorCode: int,
       *        errorDesc: 'User readable error description.'
       *      }
       *
       *      successData:                If set, the function executed successfully and
       *                                    this value will contain the return value from
       *                                    the function.
       *    }
       *  }
       */

      const iframe = document.createElement('iframe');
      iframe.setAttribute('id', `${data.instantiationId}`);
      iframe.setAttribute('sandbox', 'allow-scripts');
      iframe.setAttribute('src', `http://0.0.0.0:11038/instantiation/${data.instantiationId}`);
      iframe.setAttribute('height', '615');
      iframe.setAttribute('width', '620');
      const brokerBody = document.getElementById('bioblocks_frame_broker_body');
      if (brokerBody) {
        brokerBody.appendChild(iframe); // WORKS.
      }
    };

    window.addEventListener('message', this.onMessage);
    setTimeout(() => {
      for (const instantiationKey of Object.keys(this.instantiations)) {
        const instantiation = this.instantiations[instantiationKey];
        this.dispatchMessageToInstantiation(instantiation, BioblocksMessenger.generateNewUUID(), {
          sharedCommunicationSecret: instantiation.sharedCommunicationSecret,
          successData: {
            viz: 'Contact Map',
            vizData: {
              couplingScores: [
                { cn: 0.5, i: 1, j: 2, dist: 1 },
                { cn: 0.5, i: 2, j: 1, dist: 1 },
                { cn: 0.7, i: 3, j: 4, dist: 5 },
                { cn: 0.2, i: 8, j: 9, dist: 7 },
              ],
            },
          },
        });
      }
    }, 10000);
  }

  /**
   * @param {IBioblocksBrokerMessageEvent} e
   */
  onMessage = e => {
    /** @type IBioblocksMessage | null */
    const messageData = e.data;
    for (const instantiationKey of Object.keys(this.instantiations)) {
      const instantiation = this.instantiations[instantiationKey];
      if (e.source !== null && messageData && messageData.instantiationId === instantiation.hiddenInstantiationId) {
        if (!instantiation.source) {
          this.instantiations[instantiationKey].source = e.source;
        }
        this.handleMessageForInstantiation(e, instantiation);
      }
    }
  };

  /**
   * @param {IBioblocksBrokerMessageEvent} e
   * @param {IBioblocksData} instantiation
   */
  handleMessageForInstantiation = (e, instantiation) => {
    const messageData = e.data;
    // The aes key is decrypted by the frame with RSA as RSA has a severe length restriction.
    // https://crypto.stackexchange.com/questions/14/how-can-i-use-asymmetric-encryption-such-as-rsa-to-encrypt-an-arbitrary-length
    const aesDecryptionKey = aesjs.utils.hex.toBytes(instantiation.rsaDecryptor.decrypt(messageData.key));
    if (!aesDecryptionKey) {
      console.error('(broker) Error: Unable to decrypt aes key.');
      this.dispatchMessageToInstantiation(instantiation, messageData.messageId, {
        responseError: {
          errorCode: 100,
          errorDesc: 'unable to decrypt key',
        },
        sharedCommunicationSecret: instantiation.sharedCommunicationSecret,
      });

      return;
    }

    // Attempt to decrypt the payload.
    let aesCtr = new aesjs.ModeOfOperation.ctr(aesDecryptionKey);
    const payload = JSON.parse(
      aesjs.utils.utf8.fromBytes(aesCtr.decrypt(aesjs.utils.hex.toBytes(messageData.payload))),
    );
    if (!payload) {
      console.error('(broker) Error: Unable to parse and decrypt payload from instantiation.', instantiation);

      this.dispatchMessageToInstantiation(instantiation, messageData.messageId, {
        responseError: {
          errorCode: 101,
          errorDesc: 'Unable to parse and decrypt payload.',
        },
        sharedCommunicationSecret: instantiation.sharedCommunicationSecret,
      });

      return;
    }

    console.log(`(broker) Decrypted payload = ${JSON.stringify(payload, null, 2)}`);
    if (
      !payload.sharedCommunicationSecret ||
      payload.sharedCommunicationSecret !== instantiation.sharedCommunicationSecret
    ) {
      console.error(
        `(broker) Invalid communication attempt from iframe. Communication secrets do not match:\n
            - broker sharedCommunicationSecret = ${instantiation.sharedCommunicationSecret}\n
            - iFrame sharedCommunicationSecret = ${payload.sharedCommunicationSecret}`,
      );

      this.dispatchMessageToInstantiation(instantiation, messageData.messageId, {
        responseError: {
          errorCode: 102,
          errorDesc: 'sharedCommunicationSecret fields do not match.',
        },
        sharedCommunicationSecret: instantiation.sharedCommunicationSecret,
      });
      return;
    }

    console.log('(broker) iframe message received and validated.');
    //TODO execute the requested function

    // Respond with results.
    this.dispatchMessageToInstantiation(instantiation, messageData.messageId, {
      sharedCommunicationSecret: instantiation.sharedCommunicationSecret,
      successData: {
        'the payload key': 'this is the value of the payload key',
      },
    });
  };

  /**
   * @param {IBioblocksData} instantiation
   * @param {string} messageId
   * @param {object} unencryptedPayloadObj
   * @param {string} [targetOrigin='*']
   */
  dispatchMessageToInstantiation = (instantiation, messageId, unencryptedPayloadObj, targetOrigin = '*') => {
    this.bioblocksMessenger.dispatchPostMessage(
      instantiation.source,
      instantiation.rsaEncryptor,
      messageId,
      instantiation.hiddenInstantiationId,
      unencryptedPayloadObj,
      targetOrigin,
    );
  };
}

export const FrameBroker = new BioblocksFrameBroker();
