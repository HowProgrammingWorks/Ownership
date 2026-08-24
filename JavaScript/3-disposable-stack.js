'use strict';

class Resource {
  #name = '';

  constructor(name) {
    this.#name = name;
    console.log(`Open: ${name}`);
  }

  [Symbol.dispose]() {
    console.log(`Dispose: ${this.#name}`);
  }
}

const main = () => {
  using resources = new DisposableStack();

  resources.use(new Resource('database'));
  resources.use(new Resource('cache'));
  resources.use(new Resource('server'));
};

main();
