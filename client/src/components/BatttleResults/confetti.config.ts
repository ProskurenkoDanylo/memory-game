import { confetti } from 'tsparticles-confetti';

const shared = {
  gravity: 0,
  startVelocity: 15,
  count: 60,
  angle: 75,
  shapes: ['text', 'image'],
  scalar: 2.3,
};

const leftConfettiConfig = (emoji: string[], images: string[] = []) => {
  return {
    ...shared,
    shapeOptions: {
      text: {
        value: emoji,
      },
      image: images.map((image) => ({
        src: image,
        width: 32,
        height: 32,
      })),
    },
    position: {
      x: 0,
    },
  };
};

const rightConfettiConfig = (emoji: string[] = [], images: string[] = []) => ({
  ...shared,
  shapeOptions: {
    text: {
      value: emoji,
    },
    image: images.map((image) => ({
      src: image,
      width: 32,
      height: 32,
    })),
  },
  position: {
    x: 100,
  },
});

export function winShoot() {
  (async () => {
    await confetti('tsparticles', leftConfettiConfig(['⭐️']));
    await confetti('tsparticles', rightConfettiConfig(['⭐️']));
  })();
}

export function looseShoot() {
  (async () => {
    await confetti('tsparticles', {
      ...leftConfettiConfig(['💩']),
      scalar: 3.1,
    });
    await confetti('tsparticles', {
      ...rightConfettiConfig(['💩']),
      scalar: 3.1,
    });
  })();
}
