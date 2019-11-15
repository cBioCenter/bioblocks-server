/**
 * Handles reading and writing messages for consumption in the Bioblocks ecosystem.
 *
 * @export
 * @class BioblocksMessenger
 * @param {AESJS} foo
 */
export class BioblocksMessenger {
  dispatchPostMessage(event, rsaEncryptor, messageId, hiddenInstantiationId, unencryptedPayloadObj) {
    /** @type { import('../vendor/aesjs_3.1.2') } AESJS */
    let aesjs;

    const cryptoObj = window.crypto || window.msCrypto;
    const aesKeyBytes = cryptoObj.getRandomValues(new Uint8Array(16)); // 16 digits = 128 bit key
    const aesCtr = new aesjs.ModeOfOperation.ctr(aesKeyBytes);
    event.source.postMessage(
      {
        //only post to a specific frame
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
        targetInstantiationId: hiddenInstantiationId,
      },
      '*',
    ); //http://0.0.0.0:11038
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
  static uuid() {
    function _p8(s) {
      const p = (Math.random().toString(16) + '000000000').substr(2, 8);
      return s ? '-' + p.substr(0, 4) + '-' + p.substr(4, 4) : p;
    }
    return _p8() + _p8(true) + _p8(true) + _p8();
  }
}
