# Bioblocks Server JavaScript Guide

<!-- TOC -->

- [Bioblocks Server JavaScript Guide](#bioblocks-server-javascript-guide)
  - [Importing code](#importing-code)
  - [TypeScript](#typescript)
  - [Linting and Formatting](#linting-and-formatting)

<!-- /TOC -->

## Importing code

Our non-template JavaScript code is located in the `js` endpoint. This is further split into `bioblocks-api` and `vendor` sub-resources for first, and third, party code, respectively.

The following is an example of how both the FrameBroker and FrameWrapper import some common messaging code:

```js
import { BioblocksMessenger } from '/js/bioblocks-api/BioblocksMessenger.js';
```

## TypeScript

The JavaScript in this repo aims to be simple and clean. To that end, we are not using **any** tools like babel, TypeScript, et al, so as to not necessitate a build step **specifically** for the JavaScript.

However, this does not stop the usage of JSDoc comments - and in fact is highly recommended! For example:

```js
/** @type { import('../vendor/aesjs_3.1.2') } AESJS */
let aesjs;
```

Now your IDE should be able to get more info on the functions available to the aesjs object. See [this link in the TypeScript docs](https://www.typescriptlang.org/docs/handbook/type-checking-javascript-files.html) for more examples.

We also include a minimal tsconfig.json file to allow for static type checking through your IDE or other personal workflow!

## Linting and Formatting

Strictly speaking, linting and formatting rules are **not** enforced for the JavaScript. As mentioned above, there is no build step.

That said, we have `../tslint.json` and `../.prettierrc` configuration files allowing your IDE to provide assistance if so desired.
