'use strict';

const source = new ArrayBuffer(8);
new Uint8Array(source).set([1, 2, 3, 4]);

const message = structuredClone(
  { payload: source },
  { transfer: [source] },
);

console.log('Source byteLength:', source.byteLength);
console.log('Target byteLength:', message.payload.byteLength);
console.log('Target data:', [...new Uint8Array(message.payload)]);
