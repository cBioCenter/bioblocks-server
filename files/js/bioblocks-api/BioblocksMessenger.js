/// <reference path="../../../index.d.ts" />

/**
 * Handles reading and writing messages for consumption in the Bioblocks ecosystem.
 */
export class BioblocksMessenger {
  /**
   * @param {Window | object} windowToPostTo
   * @param {JSEncrypt} rsaEncryptor
   * @param {string} messageId
   * @param {string} hiddenInstantiationId
   * @param {IBioblocksResponsePayload} unencryptedPayloadObj
   * @param {string} targetOrigin
   * @memberof BioblocksMessenger
   */
  dispatchPostMessage(
    windowToPostTo,
    rsaEncryptor,
    messageId,
    hiddenInstantiationId,
    unencryptedPayloadObj,
    targetOrigin,
  ) {
    const cryptoObj = window.crypto || window.msCrypto;
    const aesKeyBytes = cryptoObj.getRandomValues(new Uint8Array(16)); // 16 digits = 128 bit key.
    const aesCtr = new aesjs.ModeOfOperation.ctr(aesKeyBytes);

    /** @type IBioblocksMessage */
    const message = {
      instantiationId: hiddenInstantiationId,
      // Only post to a specific frame.
      key: rsaEncryptor.encrypt(aesjs.utils.hex.fromBytes(aesKeyBytes)),
      messageId: messageId,
      payload: aesjs.utils.hex.fromBytes(
        // Convert encrypted bytes to hex for postMessage.
        aesCtr.encrypt(
          // AES encrypt the object bytes.
          aesjs.utils.utf8.toBytes(
            // Convert object string to bytes.
            JSON.stringify(unencryptedPayloadObj),
          ),
        ),
      ),
      targetInstantiationId: hiddenInstantiationId,
    };
    windowToPostTo.postMessage(message, targetOrigin); // http://0.0.0.0:11038
  }

  /**
   * @param {string} [hex=''] A string that must be in hex.
   * @returns The ASCII representation of the input string.
   */
  static hex2ascii(hex = '') {
    let str = '';
    for (let i = 0; i < hex.length; i += 2) {
      str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    return str;
  }

  /**
   * @returns A randomly generated UUID.
   */
  static generateNewUUID() {
    function _p8(s = false) {
      const p = (Math.random().toString(16) + '000000000').substr(2, 8);
      return s ? '-' + p.substr(0, 4) + '-' + p.substr(4, 4) : p;
    }
    return _p8() + _p8(true) + _p8(true) + _p8();
  }
}