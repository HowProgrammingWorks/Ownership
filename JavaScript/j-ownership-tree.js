'use strict';

class Resource {
  #name = undefined;

  constructor(name) {
    this.#name = name;
    console.log(`Open resource: ${name}`);
  }

  [Symbol.dispose]() {
    console.log(`Dispose resource: ${this.#name}`);
  }
}

class OwnerNode {
  #name = undefined;
  #resources = new DisposableStack();

  constructor(name) {
    this.#name = name;
    console.log(`Open owner: ${name}`);
  }

  own(resource) {
    return this.#resources.use(resource);
  }

  child(name) {
    const child = new OwnerNode(name);
    this.#resources.use(child);
    return child;
  }

  [Symbol.dispose]() {
    console.log(`Dispose owner: ${this.#name}`);
    this.#resources.dispose();
  }
}

const main = () => {
  using application = new OwnerNode('application');
  application.own(new Resource('server'));
  application.own(new Resource('database'));

  const worker = application.child('worker');
  worker.own(new Resource('socket'));
  worker.own(new Resource('timer'));
};

main();
