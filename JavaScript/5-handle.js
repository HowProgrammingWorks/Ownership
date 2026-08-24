'use strict';

class Counter {
  #value = 0;

  increment() {
    this.#value++;
  }

  value() {
    return this.#value;
  }

  [Symbol.dispose]() {
    this.#value = 0;
    console.log('Counter disposed');
  }
}

class OwnedCounter {
  #counter;
  #state = 'owned';

  constructor(counter) {
    this.#counter = counter;
  }

  #assertOwned() {
    if (this.#state !== 'owned') {
      throw new ReferenceError(`Resource is ${this.#state}`);
    }
  }

  increment() {
    this.#assertOwned();
    this.#counter.increment();
  }

  value() {
    this.#assertOwned();
    return this.#counter.value();
  }

  [Symbol.dispose]() {
    if (this.#state !== 'owned') return;
    this.#state = 'disposed';
    this.#counter[Symbol.dispose]();
    this.#counter = null;
  }
}

const main = () => {
  using counter = new OwnedCounter(new Counter());
  counter.increment();
  counter.increment();
  console.log(counter.value());
};

main();
