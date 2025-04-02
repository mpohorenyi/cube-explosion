import * as THREE from 'three';

import { LoadManager, Scene } from './classes';

const scene = new Scene('.webgl');

const loadManager = new LoadManager();
loadManager.loadTextures([
  '/textures/ores/coal_ore.png',
  '/textures/ores/copper_ore.png',
  '/textures/ores/diamond_ore.png',
  '/textures/ores/emerald_ore.png',
  '/textures/ores/gold_ore.png',
  '/textures/ores/iron_ore.png',
  '/textures/ores/lapis_ore.png',
  '/textures/ores/redstone_ore.png',
]);

const textures = loadManager.getAllTextures();

const box = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({
  map: textures[4],
});
const mesh = new THREE.Mesh(box, material);

scene.addMesh(mesh);
