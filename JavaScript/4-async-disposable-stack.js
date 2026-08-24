'use strict';

const timers = require('node:timers/promises');

class Resource {
  #name = '';

  constructor(name) {
    this.#name = name;
    console.log(`Open: ${name}`);
  }

  async [Symbol.asyncDispose]() {
    await timers.setTimeout(10);
    console.log(`Dispose: ${this.#name}`);
  }
}

const main = async () => {
  await using resources = new AsyncDisposableStack();

  resources.use(new Resource('database'));
  resources.use(new Resource('cache'));
  resources.use(new Resource('server'));
};

main();
