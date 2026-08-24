'use strict';

const transfer = () => {
  const source = new ArrayBuffer(8);
  const sourceView = new Uint8Array(source);
  sourceView.set([1, 2, 3, 4]);

  const target = source.transfer();
  const targetView = new Uint8Array(target);

  console.log('Source byteLength:', source.byteLength);
  console.log('Target byteLength:', target.byteLength);
  console.log('Target data:', [...targetView]);
};

const structured = () => {
  const source = new ArrayBuffer(8);
  new Uint8Array(source).set([1, 2, 3, 4]);

  const message = structuredClone({ payload: source }, { transfer: [source] });

  console.log('Source byteLength:', source.byteLength);
  console.log('Target byteLength:', message.payload.byteLength);
  console.log('Target data:', [...new Uint8Array(message.payload)]);
};

const main = () => {
  transfer();
  structured();
};

main();
