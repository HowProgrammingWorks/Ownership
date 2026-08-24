'use strict';

const timers = require('node:timers/promises');

class Resource {
  #name = undefined;

  constructor(name) {
    this.#name = name;
    console.log(`Open: ${name}`);
  }

  [Symbol.dispose]() {
    console.log(`Dispose: ${this.#name}`);
  }

  async [Symbol.asyncDispose]() {
    await timers.setTimeout(10);
    console.log(`Async dispose: ${this.#name}`);
  }
}

const stack = () => {
  using resources = new DisposableStack();

  resources.use(new Resource('database'));
  resources.use(new Resource('cache'));
  resources.use(new Resource('server'));
};

const stackAsync = async () => {
  await using resources = new AsyncDisposableStack();

  resources.use(new Resource('database'));
  resources.use(new Resource('cache'));
  resources.use(new Resource('server'));
};

const acquire = () => {
  using resources = new DisposableStack();

  resources.use(new Resource('database'));
  resources.use(new Resource('cache'));

  return resources.move();
};

const move = () => {
  using resources = acquire();
  if (resources.disposed) throw new ReferenceError('Stack already disposed');
  console.log('Ownership moved to caller');
};

const main = async () => {
  stack();
  await stackAsync();
  move();
};

main();
