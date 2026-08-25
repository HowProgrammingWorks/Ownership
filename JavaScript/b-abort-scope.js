'use strict';

const timers = require('node:timers/promises');

class AbortScope {
  #controller = new AbortController();

  signal = this.#controller.signal;

  [Symbol.dispose]() {
    this.#controller.abort(new Error('Scope disposed'));
  }
}

const main = async () => {
  let operation;

  {
    using scope = new AbortScope();
    operation = timers.setTimeout(1000, 'done', {
      signal: scope.signal,
    });
  }

  try {
    await operation;
  } catch (error) {
    console.log(error.name);
  }
};

main();
