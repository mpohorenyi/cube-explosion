import { Easing, Group, Tween } from '@tweenjs/tween.js';
import GUI from 'lil-gui';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

import { SIZES } from './constants';

// Canvas
const canvas = document.querySelector<HTMLCanvasElement>('.webgl');

if (!canvas) {
  throw new Error('Canvas element not found');
}

// Scenes
const scene = new THREE.Scene();

/**
 * Debug
 */
const gui = new GUI({
  width: 300,
  title: 'Cube Explosion',
});

/**
 * Objects
 */
const group = new THREE.Group();
scene.add(group);

const cylinder = new THREE.Mesh(
  new THREE.CylinderGeometry(0.5, 0.5, 1),
  new THREE.MeshBasicMaterial({ color: '#451278' })
);
cylinder.position.x = -1.5;
group.add(cylinder);

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: '#952247' })
);
cube.position.x = 0;
group.add(cube);

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: '#127845' })
);
sphere.position.x = 1.5;
group.add(sphere);

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, SIZES.ASPECT_RATIO, 0.1, 100);
camera.position.set(0, 0, 3);

scene.add(camera);

/**
 * Controls
 */
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(SIZES.WIDTH, SIZES.HEIGHT);

// TWEEN group
const tweenGroup = new Group();

//TWEEN animation
const animateWithTween = (): void => {
  const targetPosition = new THREE.Vector3(0, 2, 0);

  new Tween(group.position, tweenGroup)
    .to(targetPosition, 2000)
    .easing(Easing.Cubic.Out)
    .start()
    .onComplete(() => {
      new Tween(group.position, tweenGroup)
        .to({ x: 0, y: 0, z: 0 }, 2000)
        .easing(Easing.Cubic.In)
        .start();
    });
};

// Add the animation to GUI
gui.add({ animate: animateWithTween }, 'animate').name('Animate Group');

// Animations
const tick = (): void => {
  // Update TWEEN
  tweenGroup.update();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();
