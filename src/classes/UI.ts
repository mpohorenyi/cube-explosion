import GUI, { Controller } from 'lil-gui';

export interface CubeDimensions {
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
  private dimensionsFolder: GUI;

  private uiParams: {
    sizeX: number;
    sizeY: number;
    sizeZ: number;
    generate: () => void;
    explode: () => void;
    collect: () => void;
  };

  private uiState: UIState = {
    cubeGenerated: false,
    isExploded: false,
    isAnimating: false,
  };

  private generateCallback: ((dimensions: CubeDimensions) => void) | null =
    null;
  private explodeCallback: (() => void) | null = null;
  private collectCallback: (() => void) | null = null;

  private generateController: Controller;
  private explodeController: Controller;
  private collectController: Controller;

  constructor() {
    this.gui = new GUI({ title: 'Cube Generator', width: 300 });
    this.dimensionsFolder = this.gui.addFolder('Cube Dimensions');

    this.uiParams = {
      sizeX: 3,
      sizeY: 3,
      sizeZ: 3,
      generate: () => this.onGenerate(),
      explode: () => this.onExplode(),
      collect: () => this.onCollect(),
    };

    this.dimensionsFolder
      .add(this.uiParams, 'sizeX')
      .min(1)
      .max(10)
      .step(1)
      .name('Width (X)');
    this.dimensionsFolder
      .add(this.uiParams, 'sizeY')
      .min(1)
      .max(10)
      .step(1)
      .name('Height (Y)');
    this.dimensionsFolder
      .add(this.uiParams, 'sizeZ')
      .min(1)
      .max(10)
      .step(1)
      .name('Depth (Z)');

    this.generateController = this.dimensionsFolder
      .add(this.uiParams, 'generate')
      .name('Generate Cube');
    this.explodeController = this.gui
      .add(this.uiParams, 'explode')
      .name('Explode Cube');
    this.collectController = this.gui
      .add(this.uiParams, 'collect')
      .name('Collect Cube');

    this.updateButtonsState();
  }

  public getCubeDimensions(): { x: number; y: number; z: number } {
    return {
      x: this.uiParams.sizeX,
      y: this.uiParams.sizeY,
      z: this.uiParams.sizeZ,
    };
  }

  public updateUIState(options: Partial<UIState>): void {
    Object.assign(this.uiState, options);

    this.updateButtonsState();
  }

  public setGenerateCallback(
    callback: (dimensions: CubeDimensions) => void
  ): void {
    this.generateCallback = callback;
  }

  public setExplodeCallback(callback: () => void): void {
    this.explodeCallback = callback;
  }

  public setCollectCallback(callback: () => void): void {
    this.collectCallback = callback;
  }

  private validateInputs(): boolean {
    const { sizeX, sizeY, sizeZ } = this.uiParams;

    if (sizeX <= 0 || sizeY <= 0 || sizeZ <= 0) {
      console.error('All dimensions must be positive numbers');
      return false;
    }

    if (
      sizeX > this.MAX_SIZE ||
      sizeY > this.MAX_SIZE ||
      sizeZ > this.MAX_SIZE
    ) {
      console.warn(`Dimensions limited to max size: ${this.MAX_SIZE}`);

      this.uiParams.sizeX = Math.min(sizeX, this.MAX_SIZE);
      this.uiParams.sizeY = Math.min(sizeY, this.MAX_SIZE);
      this.uiParams.sizeZ = Math.min(sizeZ, this.MAX_SIZE);

      this.dimensionsFolder.controllers.forEach(controller => {
        controller.updateDisplay();
      });
    }

    const totalElements = sizeX * sizeY * sizeZ;
    if (totalElements > 1000) {
      console.warn(
        `Large cube size (${totalElements} elements). Performance might be affected.`
      );
    }

    return true;
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
    if (!this.validateInputs()) return;

    console.log(
      `Generating cube with dimensions: ${this.uiParams.sizeX}x${this.uiParams.sizeY}x${this.uiParams.sizeZ}`
    );

    if (this.generateCallback) {
      this.generateCallback(this.getCubeDimensions());
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
