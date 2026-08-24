'use strict';

const timers = require('node:timers/promises');

class Resource {
  #name = '';
  #closed = false;

  constructor(name) {
    this.#name = name;
    console.log(`Open: ${name}`);
  }

  async use() {
    if (this.#closed) throw new ReferenceError('Resource is closed');
    await timers.setTimeout(10);
    console.log(`Use: ${this.#name}`);
  }

  async [Symbol.asyncDispose]() {
    if (this.#closed) return;
    this.#closed = true;
    await timers.setTimeout(10);
    console.log(`Async dispose: ${this.#name}`);
  }
}

const main = async () => {
  await using resource = new Resource('database');
  await resource.use();
};

main();
