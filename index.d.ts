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
  source?: any;
}

declare type IMessagePromiseMap = Record<
  string,
  {
    promise: Promise<any>;
    reject(...args: any[]): void;
    resolve(...args: any[]): void;
  }
>;
declare type InstantiationMap = Record<string, IBioblocksData>;

declare interface IBioblocksResponsePayload {
  /** A secret key provided by the server that only the frame is aware of. */
  sharedCommunicationSecret: string;

  /**
   * If 'responseError' is set then 'successData' will not be set.
   */
  responseError?: {
    errorCode: number;
    /** User readable error description. */
    errorDesc: string;
  };

  /**
   * If set, the function executed successfully and this value will contain the return value from the function.
   */
  successData?: any;
}

declare interface IBioblocksResponse {
  /** The same id passed in the requesting message. */
  messageId: string;
  /** UUID unique for the instantiation (sever provided) */
  targetInstantiationId: string;
  /** RSA encrypted AES key */
  key: string;
  /** AES encrypted payload in hex. */
  payload: string;
}

declare interface IBioblocksMessagePayload {
  /** A secret key provided by the server that only the frame is aware of. */
  sharedCommunicationSecret: string;
  /** Function to execute. See below. */
  fn: string;
  /**  An object that contains key value pairs for the function. See below. */
  params: Record<string, any>;
}

declare interface IBioblocksMessage {
  /**  RSA encrypted AES key */
  key: string;
  /**  Unique id for this call - used to inform response. */
  messageId: string;
  /** AES encrypted payload in hex. */
  payload: string;

  instantiationId: string;
  /** UUID unique for the instantiation (sever provided) */
  targetInstantiationId: string;
}

declare interface IBioblocksBrokerMessageEvent extends MessageEvent {
  payload?: object;
}
