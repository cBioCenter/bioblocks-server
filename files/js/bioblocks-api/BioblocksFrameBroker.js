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
  }

  /**
   * Creates a new instantiation of a given app.
   *
   * @param {string} appId ID of app to instantiate a new iFrame for.
   * @memberof BioblocksFrameBroker
   */
  addFrameForInstantiation(appId) {
    //fix class objects to local scope
    const instantiations = this.instantiations;
    const bioblocksMessenger = new BioblocksMessenger();

    //post to bioblocks.org
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://0.0.0.0:11037/instantiation', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({ appId: appId }));

    xhr.onload = function() {
      const data = JSON.parse(this.responseText);
      console.log('(broker) instantiation processed by server with response', data);

      //listen for the new apps messages
      instantiations[data.instantiationId] = {
        framePublicKey: data.framePublicKey,
        hiddenInstantiationId: data.hiddenInstantiationId,
        instantiationId: data.instantiationId,
        outgoingMessages: [],
        parentPrivateKey: data.parentPrivateKey,
        rsaDecryptor: new JSEncrypt(),
        rsaEncryptor: new JSEncrypt(),
        sharedCommunicationSecret: data.sharedCommunicationSecret,
      };

      instantiations[data.instantiationId].rsaEncryptor.setPublicKey(BioblocksMessenger.hex2ascii(data.framePublicKey));
      instantiations[data.instantiationId].rsaDecryptor.setPrivateKey(
        BioblocksMessenger.hex2ascii(data.parentPrivateKey),
      );

      /**
       *  Listen for and respond to messages
       *  Messages take the form:
       *    {
       *      key:           RSA encrypted AES key
       *      messageId:    Unique id for this call - used to inform response
       *      payload:       AES encrypted payload in hex. Takes the form:
       *        {
       *          sharedCommunicationSecret: A secret key provided by the server that only
       *                                       the frame is aware of.
       *          fn:                          Function to execute. See below.
       *          params:                      An object that contains key value pairs for
       *                                       the function. See below.
       *        }
       *     }
       *
       *  Valid fn and params values:
       *     fn                params                    successData in returned payload
       *     --                ------                    --------------------------------
       *     init              null | {}                 {}
       *     getObject        { objId: uuid }          { objId: uuid, obj: byte[] }
       *
       *  Responses take the form:
       *    {
       *       messageId:               The same id passed in the requesting message.
       *       targetInstantiationId:  UUID unique for the instantiation (sever provided)
       *       key:                      RSA encrypted AES key
       *       payload:                  AES encrypted payload in hex. Takes the form:
       *         {
       *           sharedCommunicationSecret: A secret key provided by the server that only
       *                                        the frame is aware of.
       *           responseError:              If 'responseError' is set then 'successData'
       *                                        will not be set and the value of 'responseError'
       *                                        will contain an object like:
       *           {
       *             errorCode: int,
       *             errorDesc: 'User readable error description.'
       *           }
       *
       *           successData:                If set, the function executed successfully and
       *                                        this value will contain the return value from
       *                                        the function.
       *         }
       *
       *    }
       *
       */
      window.addEventListener('message', e => {
        console.log('(broker) message received with event:', e);
        const instantiation = instantiations[data.instantiationId];

        if (e.source instanceof Window && e.data && e.data.instantiationId === instantiation.hiddenInstantiationId) {
          //the aes key is decrypted by the frame with RSA as RSA has a severe
          //length restriction
          // https://crypto.stackexchange.com/questions/14/how-can-i-use-asymmetric-encryption-such-as-rsa-to-encrypt-an-arbitrary-length
          const aesDecryptionKey = aesjs.utils.hex.toBytes(instantiation.rsaDecryptor.decrypt(e.data.key));
          if (!aesDecryptionKey) {
            console.error('(broker) error: unable to decrypt aes key');
            bioblocksMessenger.dispatchPostMessage(
              e.source,
              instantiation.rsaEncryptor,
              e.data.messageId,
              instantiation.hiddenInstantiationId,
              {
                responseError: {
                  errorCode: 100,
                  errorDesc: 'unable to decrypt key',
                },
                sharedCommunicationSecret: instantiation.sharedCommunicationSecret,
              },
              '*',
            );
            return;
          }

          //attempt to decrypt the payload
          let aesCtr = new aesjs.ModeOfOperation.ctr(aesDecryptionKey);
          const payload = JSON.parse(
            aesjs.utils.utf8.fromBytes(aesCtr.decrypt(aesjs.utils.hex.toBytes(e.data.payload))),
          );
          if (!payload) {
            console.error('(broker) unable to parse and decrypt payload from instantiation ', instantiation);

            bioblocksMessenger.dispatchPostMessage(
              e.source,
              instantiation.rsaEncryptor,
              e.data.messageId,
              instantiation.hiddenInstantiationId,
              {
                responseError: {
                  errorCode: 101,
                  errorDesc: 'unable to parse and decrypt payload',
                },
                sharedCommunicationSecret: instantiation.sharedCommunicationSecret,
              },
              '*',
            );
            return;
          }

          console.log(`(broker) decrypted payload = ${payload}`);
          if (
            !payload.sharedCommunicationSecret ||
            payload.sharedCommunicationSecret !== instantiation.sharedCommunicationSecret
          ) {
            console.error(
              `(broker) Invalid communication attempt from iframe. Communication secrets do not match:\n
                - broker sharedCommunicationSecret = ${instantiation.sharedCommunicationSecret}\n
                - iFrame sharedCommunicationSecret = ${payload.sharedCommunicationSecret}`,
            );

            bioblocksMessenger.dispatchPostMessage(
              e.source,
              instantiation.rsaEncryptor,
              e.data.messageId,
              instantiation.hiddenInstantiationId,
              {
                responseError: {
                  errorCode: 102,
                  errorDesc: 'sharedCommunicationSecret fields do not match.',
                },
                sharedCommunicationSecret: instantiation.sharedCommunicationSecret,
              },
              '*',
            );
            return;
          }

          console.log('(broker) iframe message received and validated');
          //TODO execute the requested function

          //respond with results
          bioblocksMessenger.dispatchPostMessage(
            e.source,
            instantiation.rsaEncryptor,
            e.data.messageId,
            instantiation.hiddenInstantiationId,
            {
              sharedCommunicationSecret: instantiation.sharedCommunicationSecret,
              successData: {
                'the payload key': 'this is the value of the payload key',
              },
            },
            '*',
          );
        }
      });

      const iframe = document.createElement('iframe');
      iframe.setAttribute('id', `${data.instantiationId}`);
      iframe.setAttribute('sandbox', 'allow-scripts');
      iframe.setAttribute('src', `http://0.0.0.0:11038/instantiation/${data.instantiationId}`);
      iframe.setAttribute('height', '600');
      iframe.setAttribute('width', '800');
      const brokerBody = document.getElementById('bioblocks_frame_broker_body');
      if (brokerBody) {
        brokerBody.appendChild(iframe); //WORKS
      }
      const pingFn = () => {
        if (!iframe.contentWindow) {
          return;
        }
        console.log('SENDING MESSAGE');
        iframe.contentWindow.window.postMessage(
          {
            targetInstantiationId: data.hiddenInstantiationId,
            viz: 'Contact Map',
          },
          '*',
        );
      };

      setTimeout(pingFn, 5000);

      /*
      //console.log('iframe.contentWindow:' + iframe.contentWindow); //FAILS
      iframe.contentWindow.addEventListener('message', e => {
        console.log('******************\nI AM SNOOPING!!!!!\n********************');
      });
      */
    };
  }
}

export const FrameBroker = new BioblocksFrameBroker();
