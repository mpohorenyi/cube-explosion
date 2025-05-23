import { CubeAnimationManager, CubeGenerator, LoadManager, Scene, UI } from './classes';

const scene = new Scene('.webgl');

const loadManager = new LoadManager();

const ui = new UI();

const cubeGenerator = new CubeGenerator();

const cubeAnimationManager = new CubeAnimationManager(scene.animationGroup);

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

const environmentMap = loadManager.loadEnvironmentMap('/environment/cave-min.jpg');
scene.scene.background = environmentMap;
scene.scene.environment = environmentMap;

ui.setGenerateCallback(sizes => {
  ui.updateUIState({ isAnimating: true });

  scene.clearMeshes();

  const meshes = cubeGenerator.generateCubeMeshes(sizes.x, sizes.y, sizes.z, textures);

  scene.scene.add(...meshes)

  scene.camera.position.set(sizes.x, sizes.y, sizes.z);
  scene.controls.target.set(0, 0, 0);

  ui.updateUIState({
    cubeGenerated: true,
    isAnimating: false,
    isExploded: false,
  });
});

ui.setExplodeCallback(animationSettings => {
  ui.updateUIState({ isAnimating: true });

  cubeAnimationManager.explodeAnimation({
    meshes: cubeGenerator.getMeshes(),
    animationSettings,
    onComplete: () => {
      ui.updateUIState({ isAnimating: false, isExploded: true });
    },
  });
});

ui.setCollectCallback(animationSettings => {
  ui.updateUIState({ isAnimating: true });

  const initialPositions = cubeGenerator.getInitialPositions();

  cubeAnimationManager.collectAnimation({
    meshes: cubeGenerator.getMeshes(),
    initialPositions,
    animationSettings,
    onComplete: () => {
      ui.updateUIState({ isAnimating: false, isExploded: false });
    },
  });
});
