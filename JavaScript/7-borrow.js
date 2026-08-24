'use strict';

class Resource {
  #value = undefined;

  constructor(value) {
    this.#value = value;
  }

  read() {
    return this.#value;
  }

  write(value) {
    this.#value = value;
  }

  [Symbol.dispose]() {
    this.#value = undefined;
    console.log('Resource disposed');
  }
}

class Owner {
  #resource = null;
  #readers = 0;
  #writer = false;
  #state = 'owned';

  constructor(resource) {
    this.#resource = resource;
  }

  #assertOwned() {
    if (this.#state !== 'owned') throw new ReferenceError(this.#state);
  }

  borrow() {
    this.#assertOwned();
    if (this.#writer) throw new ReferenceError('Mutable borrow is active');
    this.#readers++;
    let active = true;
    return {
      read: () => {
        if (!active) throw new ReferenceError('Borrow expired');
        return this.#resource.read();
      },
      [Symbol.dispose]: () => {
        if (!active) return;
        active = false;
        this.#readers--;
      },
    };
  }

  borrowMut() {
    this.#assertOwned();
    if (this.#writer || this.#readers > 0) {
      throw new ReferenceError('Resource is already borrowed');
    }
    this.#writer = true;
    let active = true;
    return {
      read: () => {
        if (!active) throw new ReferenceError('Borrow expired');
        return this.#resource.read();
      },
      write: (value) => {
        if (!active) throw new ReferenceError('Borrow expired');
        this.#resource.write(value);
      },
      [Symbol.dispose]: () => {
        if (!active) return;
        active = false;
        this.#writer = false;
      },
    };
  }

  move() {
    this.#assertOwned();
    if (this.#writer || this.#readers > 0) {
      throw new ReferenceError('Resource is borrowed');
    }
    const next = new Owner(this.#resource);
    this.#resource = null;
    this.#state = 'moved';
    return next;
  }

  [Symbol.dispose]() {
    if (this.#state !== 'owned') return;
    if (this.#writer || this.#readers > 0) {
      throw new ReferenceError('Resource is borrowed');
    }
    this.#state = 'disposed';
    this.#resource[Symbol.dispose]();
    this.#resource = null;
  }
}

const borrowed = () => {
  using owner = new Owner(new Resource(42));
  {
    using first = owner.borrow();
    using second = owner.borrow();
    console.log(first.read(), second.read());

    try {
      owner.move();
    } catch (error) {
      console.log(error.message);
    }
  }
};

const borrowedMut = () => {
  using owner = new Owner(new Resource(1));

  {
    using reader = owner.borrow();
    console.log(reader.read());
    try {
      owner.borrowMut();
    } catch (error) {
      console.log(error.message);
    }
  }

  {
    using writer = owner.borrowMut();
    writer.write(2);
    console.log(writer.read());
  }
};

const main = () => {
  borrowed();
  borrowedMut();
};

main();
