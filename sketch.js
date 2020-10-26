const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes');

const settings = {
  dimensions: [ 4096, 2048 ],
  suffix: `-${random.getRandomSeed()}`
};

const sketch = () => {
  const colorCount = random.range(5, 5);
  const palette = random.shuffle(random.pick(palettes)).slice(0, colorCount);

  const createGrid = (dimension) => {
    const points = [];

    for (let x = 0; x < dimension; x++) {
      for (let y = 0; y < dimension; y++) {
        const u = dimension <= 1 ? 0.5 : x / (dimension - 1);
        const v = dimension <= 1 ? 0.5 : y / (dimension - 1);

        points.push({
          position: [u, v],
          // radius: Math.abs(random.noise2D(u, v)) * 0.05,
          // rotation: Math.abs(random.noise2D(u, v)), // For drawing character
          // color: 'black'
        });
      }
    }

    return points;
  }

  const createWall = (points) => {
    let filteredPoints = points.filter(({position}) => position[1] !== 1);
    const result = [];
    
    for ( ; filteredPoints.length > 0 ; ) {
      // Pick 2 random points
      const pointA = random.pick(filteredPoints);
      filteredPoints = filteredPoints.filter(({position}) => position[0] !== pointA.position[0] || position[1] !== pointA.position[1])

      const pointB = random.pick(filteredPoints);
      filteredPoints = filteredPoints.filter(({position}) => position[0] !== pointB.position[0] || position[1] !== pointB.position[1])
    
      result.push({
        pointA,
        pointB,
        averageY: (pointA.position[1] + pointB.position[1]) / 2,
        color: random.pick(palette)
      })
    }

    return result.sort((a, b) => a.averageY - b.averageY);
  }

  const dimension = 6;
  // const points = createGrid(6).filter(() => random.value() > 0.5);
  const points = createWall(createGrid(dimension));
  const margin = 300;
  

  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    context.lineWidth = 5;

    // points.forEach(({radius, position, color, rotation}) => {
    //   const [u, v] = position;

    //   const x = lerp(margin, width - margin, u);
    //   const y = lerp(margin, height - margin, v);

    //   // Draw circle
    //   context.beginPath();
    //   context.arc(x, y, radius * width, 0 , Math.PI * 2);
    //   context.fillStyle = color;
    //   context.fill();

    //   // Draw Character
    //   // context.save();
    //   // context.fillStyle = color;
    //   // context.font = `${radius * width}px "Helvetica"`;
    //   // context.translate(x, y);
    //   // context.rotate(rotation);
    //   // context.fillText('-', 0, 0);
    //   // context.restore();
    // })

    points.forEach(({pointA, pointB, color}) => {
      const [uA, vA] = pointA.position;
      const xA = lerp(margin, width - margin, uA);
      const yA = lerp(margin, height - margin, vA);

      const [uB, vB] = pointB.position;
      const xB = lerp(margin, width - margin, uB);
      const yB = lerp(margin, height - margin, vB);

      // Draw line
      context.beginPath();
      context.moveTo(xA, yA);
      context.lineTo(xB, yB);
      context.lineTo(xB, height - margin);
      context.lineTo(xA, height - margin);
      context.closePath();
      context.fillStyle = color;
      context.fill();
      context.strokeStyle = 'white';
      context.lineWidth = 35;
      context.stroke();
    })

    
  };
};

canvasSketch(sketch, settings);
