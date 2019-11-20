# Message Workflow for Portal Development

Inside any HTML page:

```js
// TODO Are these 2 necessary to be explicitly included?
import 'bioblocks.org/js/vendor/jsencrypt.js"></script>
import 'bioblocks.org/js/vendor/aesjs_3.1.2.js"></script>

import { FrameBroker } from 'bioblocks.org/js/bioblocks-api/BioblocksFrameBroker.js';
FrameBroker.addInstantiationFrameForApp('appId');
```

POST is sent from HTML page to bioblocks-server to create a new instantiation of the app corresponding to 'appId'.

A new entry in the database is created on the server, and a response is sent back containing an `instantiationId`.

In the FrameBroker, when a successful response is received, an iFrame is created and added to the DOM. The `src` attribute for this iFrame is obtained by sending a GET to the instantiation endpoint bioblocks-server on the `instantiationId` resource.

The returned html page is generated from `bioblocks-frame-template.html`.

## When a Message is Received in a BioblocksFrame

FrameBroker sends over `targetInstantiationId` that must match the hiddenInstantiationId of the receiving BioblocksFrame.

## Encryption

When a BioblocksFrame is created, it is provided a `parentPublicKey` for encrypting and a `framePrivateKey` for decrypting.

When a BioblocksFrame receives a message, the payload is encrypted by AES.

Decrypting this requires a decryption key which we get by decrypting the message's `key` field with the BioblocksFrame's decryptor.

This looks like:

```js
// Decrypt step 1: decrypt aes key.
const payloadDecryptionKey = aesjs.utils.hex.toBytes(this.rsaDecryptor.decrypt(data.key));
// Decrypt step 2: decrypt the aes encrypted payload.
let aesCtr = new aesjs.ModeOfOperation.ctr(payloadDecryptionKey);
const payload = JSON.parse(aesjs.utils.utf8.fromBytes(aesCtr.decrypt(aesjs.utils.hex.toBytes(data.payload))));
```
