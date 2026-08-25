'use strict';

const timers = require('node:timers/promises');

class TaskScope {
  #controller = new AbortController();
  #tasks = new Set();

  signal = this.#controller.signal;

  run(task) {
    const promise = Promise.resolve().then(() => task(this.signal));
    this.#tasks.add(promise);
    promise.finally(() => this.#tasks.delete(promise));
    return promise;
  }

  async [Symbol.asyncDispose]() {
    this.#controller.abort(new Error('Task scope disposed'));
    await Promise.allSettled([...this.#tasks]);
  }
}

const worker = async (signal, name) => {
  try {
    await timers.setTimeout(1000, null, { signal });
    console.log(`Done: ${name}`);
  } catch {
    console.log(`Cancelled: ${name}`);
  }
};

const main = async () => {
  await using scope = new TaskScope();
  scope.run((signal) => worker(signal, 'A'));
  scope.run((signal) => worker(signal, 'B'));
  await timers.setTimeout(20);
};

main();
