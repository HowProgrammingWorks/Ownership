'use strict';

const registry = new FinalizationRegistry((name) => {
  console.log(`Finalized: ${name}`);
});

const create = () => {
  const resource = { name: 'cache' };
  registry.register(resource, resource.name);
  return new WeakRef(resource);
};

const weak = create();

if (global.gc) {
  global.gc();
} else {
  console.log('Run with --expose-gc');
}

console.log('Alive now:', weak.deref() !== undefined);
console.log('Finalization is nondeterministic and not a cleanup mechanism');
