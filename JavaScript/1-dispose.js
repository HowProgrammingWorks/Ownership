'use strict';

const timers = require('node:timers/promises');

class Resource {
  #name = undefined;
  #closed = false;

  constructor(name) {
    this.#name = name;
    console.log(`Open: ${name}`);
  }

  use() {
    if (this.#closed) throw new ReferenceError('Resource is closed');
    console.log(`Use: ${this.#name}`);
  }

  [Symbol.dispose]() {
    if (this.#closed) return;
    this.#closed = true;
    console.log(`Dispose: ${this.#name}`);
  }
}

class AsyncResource {
  #name = undefined;
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

const dispose = () => {
  using resource = new Resource('socket');
  resource.use();
};

const disposeAsync = async () => {
  await using resource = new AsyncResource('database');
  await resource.use();
};

const main = async () => {
  dispose();
  await disposeAsync();
};

main();
