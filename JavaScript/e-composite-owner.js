'use strict';

class Resource {
  #name = undefined;

  constructor(name) {
    this.#name = name;
    console.log(`Open: ${name}`);
  }

  [Symbol.dispose]() {
    console.log(`Dispose: ${this.#name}`);
  }
}

class Application {
  #resources;

  constructor() {
    using resources = new DisposableStack();

    resources.use(new Resource('database'));
    resources.use(new Resource('cache'));
    resources.use(new Resource('server'));

    this.#resources = resources.move();
  }

  [Symbol.dispose]() {
    this.#resources.dispose();
  }

  run() {
    if (this.#resources.disposed) return;
    console.log('Application running');
  }
}

const main = () => {
  using application = new Application();
  application.run();
};

main();
