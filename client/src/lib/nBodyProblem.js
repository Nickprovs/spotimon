/*
 * Inputs for our nBodyProblem
 */

const g = 39.5;
const dt = 0.008; //0.005 years is equal to 1.825 days
const softeningConstant = 0.15;

const masses = [
  {
    name: "Sun", //We use solar masses as the unit of mass, so the mass of the Sun is exactly 1
    m: 1,
    x: -1.50324727873647e-6,
    y: -3.93762725944737e-6,
    z: -4.86567877183925e-8,
    vx: 3.1669325898331e-5,
    vy: -6.85489559263319e-6,
    vz: -7.90076642683254e-7
  },
  {
    name: "Mercury",
    m: 1.65956463e-7,
    x: -0.346390408691506,
    y: -0.272465544507684,
    z: 0.00951633403684172,
    vx: 4.25144321778261,
    vy: -7.61778341043381,
    vz: -1.01249478093275
  },
  {
    name: "Venus",
    m: 2.44699613e-6,
    x: -0.168003526072526,
    y: 0.698844725464528,
    z: 0.0192761582256879,
    vx: -7.2077847105093,
    vy: -1.76778886124455,
    vz: 0.391700036358566
  },
  {
    name: "Earth",
    m: 3.0024584e-6,
    x: 0.648778995445634,
    y: 0.747796691108466,
    z: -3.22953591923124e-5,
    vx: -4.85085525059392,
    vy: 4.09601538682312,
    vz: -0.000258553333317722
  },
  {
    m: 3.213e-7,
    name: "Mars",
    x: -0.574871406752105,
    y: -1.395455041953879,
    z: -0.01515164037265145,
    vx: 4.9225288800471425,
    vy: -1.5065904473191791,
    vz: -0.1524041758922603
  }
];

/*
 * Create an instance of the nBodyProblem with the inputs above
 * We clone the masses array by parsing a stringified version of it so that we can reset the simulator with a minimum amount of fuss
 */

const innerSolarSystem = new nBodyProblem({
  g,
  dt,
  masses: JSON.parse(JSON.stringify(masses)),
  softeningConstant
});

/*
 * Motion trails
 */

/*
 * Get the canvas element and its context from the DOM
 */

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

/*
 * Full screen action
 */

const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

/*
 * Animation constants
 *
 * scale is the number of pixels per astronomical units
 *
 * radius is the radius of the circle that represents the current position of a mass
 *
 * trailLength is the number of previous positions that we should draw in the motion trail
 */

const scale = 70;
const radius = 4;
const trailLength = 35;

/*
 * Iterate over the masses being simulated and add a visual manifestation for each of them
 */

const populateManifestations = masses => {
  masses.forEach(mass => (mass["manifestation"] = new Manifestation(ctx, trailLength, radius)));
};

populateManifestations(innerSolarSystem.masses);

/*
 * Click the reset button to reset the simulation
 */

document.querySelector("#reset-button").addEventListener(
  "click",
  () => {
    innerSolarSystem.masses = JSON.parse(JSON.stringify(masses));
    populateManifestations(innerSolarSystem.masses);
  },
  false
);

/*
 * Code for adding masses with you mouse
 */

//Step 1.

let mousePressX = 0;
let mousePressY = 0;

//Step 2.

let currentMouseX = 0;
let currentMouseY = 0;

//Step 3.

let dragging = false;

//Step 4.

canvas.addEventListener(
  "mousedown",
  e => {
    mousePressX = e.clientX;
    mousePressY = e.clientY;
    dragging = true;
  },
  false
);

//Step 5

canvas.addEventListener(
  "mousemove",
  e => {
    currentMouseX = e.clientX;
    currentMouseY = e.clientY;
  },
  false
);

//Step 6

const massesList = document.querySelector("#masses-list");

canvas.addEventListener(
  "mouseup",
  e => {
    const x = (mousePressX - width / 2) / scale;
    const y = (mousePressY - height / 2) / scale;
    const z = 0;
    const vx = (e.clientX - mousePressX) / 35;
    const vy = (e.clientY - mousePressY) / 35;
    const vz = 0;

    innerSolarSystem.masses.push({
      m: parseFloat(massesList.value),
      x,
      y,
      z,
      vx,
      vy,
      vz,
      manifestation: new Manifestation(ctx, trailLength, radius)
    });

    dragging = false;
  },
  false
);

/*
 * The animate function that sets everything in motion.
 * We run it 60 times a second with the help of requestAnimationFrame
 */

const animate = () => {
  /*
   * Advance our simulation by one step
   */

  innerSolarSystem
    .updatePositionVectors()
    .updateAccelerationVectors()
    .updateVelocityVectors();

  /*
   * Clear the canvas in preparation for the next drawing cycle
   */

  ctx.clearRect(0, 0, width, height);

  const massesLen = innerSolarSystem.masses.length;

  /*
   * Let us draw some masses!
   */

  for (let i = 0; i < massesLen; i++) {
    const massI = innerSolarSystem.masses[i];

    /*
     * The origin (x = 0, y = 0) of the canvas coordinate system is in the top left corner
     * To prevent our simulation from being centered on the top left corner, include the x and y offsets
     * So that it is centered smack in the middle of the canvas
     */

    const x = width / 2 + massI.x * scale;
    const y = height / 2 + massI.y * scale;

    /*
     * Draw our motion trail
     */

    massI.manifestation.draw(x, y);

    /*
     * If the mass has a name, draw it onto the canvas next to the leading circle of the motion trail
     */

    if (massI.name) {
      ctx.font = "14px Arial";
      ctx.fillText(massI.name, x + 12, y + 4);
      ctx.fill();
    }

    /*
     * Stop masses from escaping the bounds of the viewport
     * If either condition is met, the velocity of the mass will be reversed
     * And the mass will bounce back into the inner solar system
     */

    if (x < radius || x > width - radius) massI.vx = -massI.vx;

    if (y < radius || y > height - radius) massI.vy = -massI.vy;
  }

  /*
   * Draw the line which indicates direction and velocity of a mass that is about to be added when the mouse is being dragged
   */

  if (dragging) {
    ctx.beginPath();
    ctx.moveTo(mousePressX, mousePressY);
    ctx.lineTo(currentMouseX, currentMouseY);
    ctx.strokeStyle = "red";
    ctx.stroke();
  }

  requestAnimationFrame(animate);
};

animate();
