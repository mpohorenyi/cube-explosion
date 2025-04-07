import GUI, { Controller } from 'lil-gui';

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
    explode: () => void;
  };

  private collectAnimationFolder!: {
    collect: () => void;
  };

  private uiState: UIState = {
    cubeGenerated: false,
    isExploded: false,
    isAnimating: false,
  };

  private generateCallback: ((sizes: CubeSizes) => void) | null = null;
  private explodeCallback: (() => void) | null = null;
  private collectCallback: (() => void) | null = null;

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

    this.generateController = cubeFolder
      .add(this.cubeFolder, 'generate')
      .name('Generate Cube');
  }

  private setupExplodeAnimationFolder(): void {
    const explodeAnimationFolder = this.gui.addFolder('Explode Animation');

    this.explodeAnimationFolder = {
      explode: () => this.onExplode(),
    };

    this.explodeController = explodeAnimationFolder
      .add(this.explodeAnimationFolder, 'explode')
      .name('Explode Cube');
  }

  private setupCollectAnimationFolder(): void {
    const collectAnimationFolder = this.gui.addFolder('Collect Animation');

    this.collectAnimationFolder = {
      collect: () => this.onCollect(),
    };

    this.collectController = collectAnimationFolder
      .add(this.collectAnimationFolder, 'collect')
      .name('Collect Cube');
  }

  public getCubeSizes(): CubeSizes {
    return { ...this.cubeFolder.sizes };
  }

  public updateUIState(options: Partial<UIState>): void {
    Object.assign(this.uiState, options);

    this.updateButtonsState();
  }

  public setGenerateCallback(callback: (sizes: CubeSizes) => void): void {
    this.generateCallback = callback;
  }

  public setExplodeCallback(callback: () => void): void {
    this.explodeCallback = callback;
  }

  public setCollectCallback(callback: () => void): void {
    this.collectCallback = callback;
  }

  private updateButtonsState(): void {
    this.generateController.disable(this.uiState.isAnimating);

    this.explodeController.disable(
      !this.uiState.cubeGenerated ||
        this.uiState.isExploded ||
        this.uiState.isAnimating
    );

    this.collectController.disable(
      !this.uiState.cubeGenerated ||
        !this.uiState.isExploded ||
        this.uiState.isAnimating
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
    if (
      !this.uiState.cubeGenerated ||
      this.uiState.isExploded ||
      this.uiState.isAnimating
    )
      return;

    console.log('Exploding cube...');

    if (this.explodeCallback) {
      this.explodeCallback();
    }
  }

  private onCollect(): void {
    if (
      !this.uiState.cubeGenerated ||
      !this.uiState.isExploded ||
      this.uiState.isAnimating
    )
      return;

    console.log('Collecting cube...');

    if (this.collectCallback) {
      this.collectCallback();
    }
  }
}
