import { CubeGenerator, LoadManager, Scene } from './classes';

const scene = new Scene('.webgl');

const loadManager = new LoadManager();

const textures = loadManager.loadTextures([
  '/textures/blocks/gravel.png',
  '/textures/blocks/stone.png',
  '/textures/ores/coal_ore.png',
  '/textures/ores/copper_ore.png',
  '/textures/ores/diamond_ore.png',
  '/textures/ores/emerald_ore.png',
  '/textures/ores/gold_ore.png',
  '/textures/ores/iron_ore.png',
  '/textures/ores/lapis_ore.png',
  '/textures/ores/redstone_ore.png',
]);

const size = {
  x: 10,
  y: 10,
  z: 10,
};

const cubeGenerator = new CubeGenerator();

scene.clearMeshes();

const { meshes } = cubeGenerator.generateCubeMeshes(
  size.x,
  size.y,
  size.z,
  textures
);

meshes.forEach(mesh => scene.addMesh(mesh));
