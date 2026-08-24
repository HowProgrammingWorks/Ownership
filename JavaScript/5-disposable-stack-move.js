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

const acquire = () => {
  using resources = new DisposableStack();

  resources.use(new Resource('database'));
  resources.use(new Resource('cache'));

  return resources.move();
};

const main = () => {
  using resources = acquire();
  console.log('Ownership moved to caller');
};

main();
