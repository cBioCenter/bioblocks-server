/**
 * This file is __solely__ to help developers / tools utilizing TypeScript to type-check the JavaScript code.
 *
 * We can let the compiler know about these types by adding a comment to the top of an existing .js file:
 * /// <reference path="../globals.d.ts" />
 */

// Ordinarily these variables are globally injected at runtime - so we can let the compiler know that with this comment in a .js file:
declare const aesjs: typeof import('/js/vendor/aesjs_3.1.2.js');
declare const JSEncrypt: typeof import('/js/vendor/jsencrypt.js').JSEncrypt;
// tslint:disable-next-line: interface-name
declare interface Window {
  msCrypto?: Crypto; // for IE 11
}

declare interface IBioblocksData {
  framePublicKey: string;
  hiddenInstantiationId: string;
  instantiationId: string;
  outgoingMessages: any[];
  parentPrivateKey: string;
  rsaDecryptor: InstanceType<typeof JSEncrypt>;
  rsaEncryptor: InstanceType<typeof JSEncrypt>;
  sharedCommunicationSecret: string;
}

declare type IMessagePromiseMap = Record<string, any>;
declare type InstantiationMap = Record<string, IBioblocksData>;
