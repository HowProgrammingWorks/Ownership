'use strict';

const timers = require('node:timers/promises');

class Lock {
  #release = null;

  constructor(release) {
    this.#release = release;
  }

  [Symbol.dispose]() {
    if (!this.#release) return;
    const release = this.#release;
    this.#release = null;
    release();
  }
}

class Mutex {
  #locked = false;
  #waiters = [];

  #release() {
    const resolve = this.#waiters.shift();
    if (resolve) {
      resolve(new Lock(() => this.#release()));
      return;
    }
    this.#locked = false;
  }

  async acquire() {
    if (!this.#locked) {
      this.#locked = true;
      return new Lock(() => this.#release());
    }
    return new Promise((resolve) => {
      this.#waiters.push(resolve);
    });
  }
}

const critical = async (mutex, name) => {
  using lock = await mutex.acquire();
  if (!lock) throw new ReferenceError('Lock not acquired');
  console.log(`Enter: ${name}`);
  await timers.setTimeout(20);
  console.log(`Leave: ${name}`);
};

const main = async () => {
  const mutex = new Mutex();
  await Promise.all([
    critical(mutex, 'A'),
    critical(mutex, 'B'),
    critical(mutex, 'C'),
  ]);
};

main();
