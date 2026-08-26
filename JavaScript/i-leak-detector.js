'use strict';

class TrackedResource {
  static #registry = new FinalizationRegistry((name) => {
    console.warn(`Possible leak: ${name} was not disposed`);
  });

  #name = undefined;
  #token = {};
  #disposed = false;

  constructor(name) {
    this.#name = name;
    TrackedResource.#registry.register(this, name, this.#token);
  }

  use() {
    if (this.#disposed) throw new ReferenceError('Resource is disposed');
    console.log(`Use: ${this.#name}`);
  }

  [Symbol.dispose]() {
    if (this.#disposed) return;
    this.#disposed = true;
    TrackedResource.#registry.unregister(this.#token);
    console.log(`Dispose: ${this.#name}`);
  }
}

const correct = () => {
  using resource = new TrackedResource('database');
  resource.use();
};

const leaked = () => {
  const resource = new TrackedResource('socket');
  resource.use();
};

correct();
leaked();

if (global.gc) {
  global.gc();
} else {
  console.log('Run with --expose-gc to observe');
}
