// Daniel Shiffman
// https://thecodingtrain.com/CodingChallenges/146-rendering-ray-casting.html
// https://youtu.be/vYgIKn7iDH8

// Rendering Ray Casting
// https://editor.p5js.org/codingtrain/sketches/yEzlR0_zq

class Particle {
  constructor() {
    this.fov = 60;
    this.pos = createVector(10, sceneH / 2);
    this.rays = [];
    this.heading = 0;
    for (let a = -this.fov / 2; a < this.fov / 2; a += 0.05) {
      this.rays.push(new Ray(this.pos, radians(a)));
    }

  }

  look() {
    const scene = [];
    for (let i = 0; i < this.rays.length; i++) {
      const ray = this.rays[i];
      let closest = null;
      let record = Infinity;
      for (let wall of walls) {
        const pt = ray.cast(wall);
        if (pt) {
          let d = p5.Vector.dist(this.pos, pt);
          const a = ray.dir.heading() - this.heading;
          d *= cos(a);
          if (d < record) {
            record = d;
            closest = pt;
          }
        }
      }
      scene[i] = record;
    }
    return scene;
  }
}
