'use strict';

const timers = require('node:timers/promises');

class Transaction {
  #state = 'active';

  async execute(sql) {
    if (this.#state !== 'active') throw new ReferenceError(this.#state);
    console.log(`Execute: ${sql}`);
    await timers.setTimeout(10);
  }

  async commit() {
    if (this.#state !== 'active') throw new ReferenceError(this.#state);
    this.#state = 'committed';
    console.log('Commit');
  }

  async [Symbol.asyncDispose]() {
    if (this.#state !== 'active') return;
    this.#state = 'rolled back';
    await timers.setTimeout(10);
    console.log('Rollback');
  }
}

const database = {
  async transaction() {
    return new Transaction();
  },
};

const successful = async (database) => {
  await using transaction = await database.transaction();
  await transaction.execute('insert A');
  await transaction.commit();
};

const failed = async (database) => {
  try {
    await using transaction = await database.transaction();
    await transaction.execute('insert B');
    throw new Error('Failure');
  } catch (error) {
    console.log(error.message);
  }
};

const main = async () => {
  await successful(database);
  await failed(database);
};

main();
