'use strict';

const revocable = (target) => {
  const { proxy, revoke } = Proxy.revocable(target, {});
  return {
    value: proxy,
    [Symbol.dispose]: revoke,
  };
};

const main = () => {
  const resource = {
    read: () => console.log('Read'),
  };

  let reference;
  {
    using capability = revocable(resource);
    reference = capability.value;
    reference.read();
  }

  try {
    reference.read();
  } catch (error) {
    console.log(error.name);
  }
};

main();
