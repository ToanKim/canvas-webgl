const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes');

const settings = {
  dimensions: [ 2048, 2048 ]
};

const sketch = () => {
  const colorCount = random.range(2, 5);
  const palette = random.shuffle(random.pick(palettes)).slice(0, colorCount);

  const createGrid = (dimension) => {
    const points = [];

    for (let x = 0; x < dimension; x++) {
      for (let y = 0; y < dimension; y++) {
        const u = dimension <= 1 ? 0.5 : x / (dimension - 1);
        const v = dimension <= 1 ? 0.5 : y / (dimension - 1);

        points.push({
          position: [u, v],
          radius: Math.abs(random.noise2D(u, v)) * 0.25,
          rotation: Math.abs(random.noise2D(u, v)),
          color: random.pick(palette)
        });
      }
    }

    return points;
  }

  const pointCount = 40;
  const points = createGrid(pointCount).filter(() => random.value() > 0.5);
  const margin = 300;
  

  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    points.forEach(({radius, position, color, rotation}) => {
      const [u, v] = position;

      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, height - margin, v);

      // context.beginPath();
      // context.arc(x, y, radius * width, 0 , Math.PI * 2);
      // context.fillStyle = color;
      // context.fill();

      context.save();
      context.fillStyle = color;
      context.font = `${radius * width}px "Helvetica"`;
      context.translate(x, y);
      context.rotate(rotation);
      context.fillText('-', 0, 0);
      context.restore();
    })
  };
};

canvasSketch(sketch, settings);
