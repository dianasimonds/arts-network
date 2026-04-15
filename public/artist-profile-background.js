const profileBackgroundState = {
  paletteName: "Earth",
  motionName: "gentle"
};

const profilePalettes = {
  Earth: {
    top: "#f6f1e8",
    bottom: "#eadfce",
    deep: "#16324f",
    mid: "#3f6b68",
    warm: "#d9895b",
    light: "#f7d9c7"
  },
  Dusk: {
    top: "#1b1d36",
    bottom: "#3a2d4f",
    deep: "#5c3b6f",
    mid: "#a05f7c",
    warm: "#f0a36b",
    light: "#f3d9c9"
  },
  Moss: {
    top: "#eef3ea",
    bottom: "#dbe4d3",
    deep: "#18342e",
    mid: "#406b5b",
    warm: "#c4935d",
    light: "#f1e4c8"
  },
  "Blue Hour": {
    top: "#e8edf5",
    bottom: "#cfd8ea",
    deep: "#13233f",
    mid: "#315b8a",
    warm: "#d98f70",
    light: "#f4ddd2"
  }
};

const profileMotionPresets = {
  gentle: {
    velocityX: 0.12,
    velocityY: 0.08,
    floatX: 18,
    floatY: 14,
    grain: 120
  },
  still: {
    velocityX: 0.04,
    velocityY: 0.03,
    floatX: 8,
    floatY: 6,
    grain: 80
  },
  float: {
    velocityX: 0.2,
    velocityY: 0.14,
    floatX: 28,
    floatY: 22,
    grain: 140
  }
};

function currentPalette() {
  return profilePalettes[profileBackgroundState.paletteName];
}

function currentMotion() {
  return profileMotionPresets[profileBackgroundState.motionName];
}

function updateControlButtons(attributeName, activeValue) {
  document.querySelectorAll(`[data-${attributeName}]`).forEach((button) => {
    button.classList.toggle("is-active", button.dataset[attributeName] === activeValue);
  });
}

document.querySelectorAll("[data-palette]").forEach((button) => {
  button.addEventListener("click", () => {
    profileBackgroundState.paletteName = button.dataset.palette;
    updateControlButtons("palette", profileBackgroundState.paletteName);
  });
});

document.querySelectorAll("[data-motion]").forEach((button) => {
  button.addEventListener("click", () => {
    profileBackgroundState.motionName = button.dataset.motion;
    updateControlButtons("motion", profileBackgroundState.motionName);
  });
});

new p5((p) => {
  const blobs = [];

  function seedBlobs() {
    blobs.length = 0;
    const motion = currentMotion();

    for (let index = 0; index < 7; index += 1) {
      blobs.push({
        x: p.random(p.width),
        y: p.random(p.height),
        r: p.random(180, 340),
        stretch: p.random(0.85, 1.15),
        dx: p.random(-motion.velocityX, motion.velocityX),
        dy: p.random(-motion.velocityY, motion.velocityY),
        phase: p.random(p.TWO_PI),
        drift: p.random(0.2, 0.6),
        colorKey: p.random(["deep", "mid", "warm", "light"]),
        alpha: p.random(34, 68)
      });
    }
  }

  function fillWithAlpha(hex, alpha) {
    const color = p.color(hex);
    color.setAlpha(alpha);
    p.fill(color);
  }

  function drawGradientBackground() {
    const palette = currentPalette();

    for (let y = 0; y < p.height; y += 1) {
      const t = p.map(y, 0, p.height, 0, 1);
      const color = p.lerpColor(p.color(palette.top), p.color(palette.bottom), t);
      p.stroke(color);
      p.line(0, y, p.width, y);
    }

    p.noStroke();
  }

  function addSoftGrain() {
    const motion = currentMotion();
    p.stroke(255, 12);
    for (let index = 0; index < motion.grain; index += 1) {
      p.point(p.random(p.width), p.random(p.height));
    }
    p.noStroke();
  }

  p.setup = () => {
    const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
    canvas.parent("profile-background");
    seedBlobs();
    p.noStroke();
  };

  p.draw = () => {
    const palette = currentPalette();
    const motion = currentMotion();

    drawGradientBackground();

    blobs.forEach((blob) => {
      const floatX = p.sin(p.frameCount * 0.003 * blob.drift + blob.phase) * motion.floatX;
      const floatY = p.cos(p.frameCount * 0.0025 * blob.drift + blob.phase) * motion.floatY;

      fillWithAlpha(palette[blob.colorKey], blob.alpha);
      p.ellipse(blob.x + floatX, blob.y + floatY, blob.r, blob.r * blob.stretch);

      blob.x += blob.dx;
      blob.y += blob.dy;

      if (blob.x < -blob.r) blob.x = p.width + blob.r;
      if (blob.x > p.width + blob.r) blob.x = -blob.r;
      if (blob.y < -blob.r) blob.y = p.height + blob.r;
      if (blob.y > p.height + blob.r) blob.y = -blob.r;
    });

    addSoftGrain();
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    seedBlobs();
  };
});
