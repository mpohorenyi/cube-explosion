import { CubeGenerator, LoadManager, Scene, UI } from './classes';

const scene = new Scene('.webgl');

const loadManager = new LoadManager();

const ui = new UI();

const cubeGenerator = new CubeGenerator();

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

ui.setGenerateCallback(dimensions => {
  ui.updateUIState({ isAnimating: true });

  try {
    scene.clearMeshes();
  } catch (error) {
    console.error('Error while clearing meshes:', error);
  }

  const { meshes } = cubeGenerator.generateCubeMeshes(
    dimensions.x,
    dimensions.y,
    dimensions.z,
    textures
  );

  meshes.forEach(mesh => scene.addMesh(mesh));

  scene.setCameraPosition({
    x: dimensions.x,
    y: dimensions.y,
    z: dimensions.z,
  });
  scene.setCameraLookAt({ x: 0, y: 0, z: 0 });

  ui.updateUIState({ cubeGenerated: true, isAnimating: false });
});
