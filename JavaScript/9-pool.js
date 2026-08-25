'use strict';

const timers = require('node:timers/promises');

class Connection {
  #id = undefined;

  constructor(id) {
    this.#id = id;
  }

  async query(sql) {
    console.log(`Connection ${this.#id}: ${sql}`);
    await timers.setTimeout(20);
  }
}

class Lease {
  #resource = null;
  #release = null;

  constructor(resource, release) {
    this.#resource = resource;
    this.#release = release;
  }

  query(sql) {
    if (!this.#resource) throw new ReferenceError('Lease expired');
    return this.#resource.query(sql);
  }

  [Symbol.dispose]() {
    if (!this.#resource) return;
    const resource = this.#resource;
    this.#resource = null;
    this.#release(resource);
  }
}

class Pool {
  #available;
  #waiters = [];

  constructor(size) {
    this.#available = Array.from(
      { length: size },
      (_, index) => new Connection(index + 1),
    );
  }

  #release(resource) {
    const resolve = this.#waiters.shift();
    if (resolve) {
      resolve(new Lease(resource, (item) => this.#release(item)));
      return;
    }
    this.#available.push(resource);
  }

  async acquire() {
    const resource = this.#available.shift();
    if (resource) return new Lease(resource, (item) => this.#release(item));
    return new Promise((resolve) => {
      this.#waiters.push(resolve);
    });
  }
}

const client = async (pool, id) => {
  using connection = await pool.acquire();
  await connection.query(`select ${id}`);
};

const main = async () => {
  const pool = new Pool(2);
  await Promise.all([client(pool, 1), client(pool, 2), client(pool, 3)]);
};

main();
