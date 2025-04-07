import GUI, { Controller } from 'lil-gui';

import { CollectAnimationSettings, ExplodeAnimationSettings } from './types';

export interface CubeSizes {
  x: number;
  y: number;
  z: number;
}
export interface UIState {
  cubeGenerated: boolean;
  isExploded: boolean;
  isAnimating: boolean;
}

export class UI {
  private readonly MAX_SIZE = 10;

  private gui: GUI;

  private cubeFolder!: {
    sizes: CubeSizes;
    generate: () => void;
  };

  private explodeAnimationFolder!: {
    animationSettings: ExplodeAnimationSettings;
    explode: () => void;
  };

  private collectAnimationFolder!: {
    animationSettings: CollectAnimationSettings;
    collect: () => void;
  };

  private uiState: UIState = {
    cubeGenerated: false,
    isExploded: false,
    isAnimating: false,
  };

  private generateCallback: ((sizes: CubeSizes) => void) | null = null;
  private explodeCallback: ((animationSettings: ExplodeAnimationSettings) => void) | null = null;
  private collectCallback: ((animationSettings: CollectAnimationSettings) => void) | null = null;

  private generateController!: Controller;
  private explodeController!: Controller;
  private collectController!: Controller;

  constructor() {
    this.gui = new GUI({ title: 'Cube Generator', width: 300 });

    this.setupCubeFolder();
    this.setupExplodeAnimationFolder();
    this.setupCollectAnimationFolder();

    this.updateButtonsState();
  }

  private setupCubeFolder(): void {
    const cubeFolder = this.gui.addFolder('Cube Settings');

    this.cubeFolder = {
      sizes: { x: 5, y: 5, z: 5 },
      generate: () => this.onGenerate(),
    };

    const controlsConfig = [
      { key: 'x', name: 'Width (X)', min: 1, max: this.MAX_SIZE, step: 1 },
      { key: 'y', name: 'Height (Y)', min: 1, max: this.MAX_SIZE, step: 1 },
      { key: 'z', name: 'Depth (Z)', min: 1, max: this.MAX_SIZE, step: 1 },
    ];

    controlsConfig.forEach(control => {
      cubeFolder
        .add(this.cubeFolder.sizes, control.key as keyof CubeSizes)
        .min(control.min)
        .max(control.max)
        .step(control.step)
        .name(control.name);
    });

    this.generateController = cubeFolder.add(this.cubeFolder, 'generate').name('Generate Cube');
  }

  private setupExplodeAnimationFolder(): void {
    const explodeAnimationFolder = this.gui.addFolder('Explode Animation');
    const centerFolder = explodeAnimationFolder.addFolder('Explosion Center');

    this.explodeAnimationFolder = {
      animationSettings: {
        explosionForceMultiplier: 3.5,
        explosionOffsetMultiplier: 0.7,
        baseRotationSpeed: 1,
        animationDuration: 1500,
        delayPerDistance: 10,
        randomFactorMultiplier: 0.2,
        explosionCenter: { x: 0, y: 0, z: 0 },
      },
      explode: () => this.onExplode(),
    };

    const animationControlsConfig = [
      { key: 'explosionForceMultiplier', name: 'Explosion Force', min: 1.5, max: 10, step: 0.1 },
      { key: 'explosionOffsetMultiplier', name: 'Explosion Offset', min: 0.1, max: 3, step: 0.1 },
      { key: 'baseRotationSpeed', name: 'Base Rotation Speed', min: 0.1, max: 5, step: 0.1 },
      { key: 'animationDuration', name: 'Animation Duration', min: 100, max: 5000, step: 100 },
      { key: 'delayPerDistance', name: 'Delay Per Distance', min: 10, max: 100, step: 10 },
      { key: 'randomFactorMultiplier', name: 'Random Factor', min: 0.1, max: 1, step: 0.1 },
    ];

    const centerControlsConfig = [
      { key: 'x', name: 'X', min: -10, max: 10, step: 0.5 },
      { key: 'y', name: 'Y', min: -10, max: 10, step: 0.5 },
      { key: 'z', name: 'Z', min: -10, max: 10, step: 0.5 },
    ];

    animationControlsConfig.forEach(control => {
      explodeAnimationFolder
        .add(
          this.explodeAnimationFolder.animationSettings,
          control.key as keyof ExplodeAnimationSettings
        )
        .min(control.min)
        .max(control.max)
        .step(control.step)
        .name(control.name);
    });

    centerControlsConfig.forEach(control => {
      centerFolder
        .add(
          this.explodeAnimationFolder.animationSettings.explosionCenter,
          control.key as keyof ExplodeAnimationSettings['explosionCenter']
        )
        .min(control.min)
        .max(control.max)
        .step(control.step)
        .name(control.name);
    });

    centerFolder.close();

    this.explodeController = explodeAnimationFolder
      .add(this.explodeAnimationFolder, 'explode')
      .name('Explode Cube');
  }

  private setupCollectAnimationFolder(): void {
    const collectAnimationFolder = this.gui.addFolder('Collect Animation');

    this.collectAnimationFolder = {
      animationSettings: {
        animationDuration: 1500,
      },
      collect: () => this.onCollect(),
    };

    const controlsConfig = [
      { key: 'animationDuration', name: 'Animation Duration', min: 100, max: 5000, step: 100 },
    ];

    controlsConfig.forEach(control => {
      collectAnimationFolder
        .add(
          this.collectAnimationFolder.animationSettings,
          control.key as keyof CollectAnimationSettings
        )
        .min(control.min)
        .max(control.max)
        .step(control.step)
        .name(control.name);
    });

    this.collectController = collectAnimationFolder
      .add(this.collectAnimationFolder, 'collect')
      .name('Collect Cube');
  }

  public getCubeSizes(): CubeSizes {
    return { ...this.cubeFolder.sizes };
  }

  public getExplodeAnimationSettings(): ExplodeAnimationSettings {
    return { ...this.explodeAnimationFolder.animationSettings };
  }

  public getCollectAnimationSettings(): CollectAnimationSettings {
    return { ...this.collectAnimationFolder.animationSettings };
  }

  public updateUIState(options: Partial<UIState>): void {
    Object.assign(this.uiState, options);

    this.updateButtonsState();
  }

  public setGenerateCallback(callback: (sizes: CubeSizes) => void): void {
    this.generateCallback = callback;
  }

  public setExplodeCallback(callback: (animationSettings: ExplodeAnimationSettings) => void): void {
    this.explodeCallback = callback;
  }

  public setCollectCallback(callback: (animationSettings: CollectAnimationSettings) => void): void {
    this.collectCallback = callback;
  }

  private updateButtonsState(): void {
    this.generateController.disable(this.uiState.isAnimating);

    this.explodeController.disable(
      !this.uiState.cubeGenerated || this.uiState.isExploded || this.uiState.isAnimating
    );

    this.collectController.disable(
      !this.uiState.cubeGenerated || !this.uiState.isExploded || this.uiState.isAnimating
    );
  }

  private onGenerate(): void {
    console.log(
      `Generating cube with dimensions: ${this.cubeFolder.sizes.x}x${this.cubeFolder.sizes.y}x${this.cubeFolder.sizes.z}`
    );

    if (this.generateCallback) {
      this.generateCallback(this.getCubeSizes());
    }
  }

  private onExplode(): void {
    if (!this.uiState.cubeGenerated || this.uiState.isExploded || this.uiState.isAnimating) return;

    console.log('Exploding cube...');

    if (this.explodeCallback) {
      this.explodeCallback(this.getExplodeAnimationSettings());
    }
  }

  private onCollect(): void {
    if (!this.uiState.cubeGenerated || !this.uiState.isExploded || this.uiState.isAnimating) return;

    console.log('Collecting cube...');

    if (this.collectCallback) {
      this.collectCallback(this.getCollectAnimationSettings());
    }
  }
}
