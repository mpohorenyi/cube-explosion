import * as THREE from 'three';

export class LoadManager {
  private loadingManager: THREE.LoadingManager;
  private textureLoader: THREE.TextureLoader;
  private textures: Map<string, THREE.Texture> = new Map();

  constructor() {
    this.loadingManager = new THREE.LoadingManager();
    this.textureLoader = new THREE.TextureLoader(this.loadingManager);

    this.setupLoadingManager();
  }

  public loadEnvironmentMap(url: string): THREE.Texture {
    const texture = this.textureLoader.load(
      url,
      undefined,
      undefined,
      error => {
        console.error(`Error loading environment map ${url}:`, error);
      }
    );
    texture.mapping = THREE.EquirectangularReflectionMapping;
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  public loadTexture(url: string): THREE.Texture {
    if (this.textures.has(url)) {
      return this.textures.get(url)!;
    }

    const texture = this.textureLoader.load(
      url,
      undefined,
      undefined,
      error => {
        console.error(`Error loading texture ${url}:`, error);
      }
    );

    texture.colorSpace = THREE.SRGBColorSpace;
    texture.generateMipmaps = false;
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;

    this.textures.set(url, texture);

    return texture;
  }

  public loadTextures(urls: string[]): THREE.Texture[] {
    return urls.map(url => this.loadTexture(url));
  }

  public getAllTextures(): THREE.Texture[] {
    return Array.from(this.textures.values());
  }

  private setupLoadingManager(): void {
    this.loadingManager.onStart = (
      url: string,
      loaded: number,
      total: number
    ) => {
      console.log(`Loading asset: ${url}: ${loaded}/${total}`);
    };

    this.loadingManager.onLoad = () => {
      console.log('All assets loaded');
    };

    this.loadingManager.onProgress = (
      url: string,
      loaded: number,
      total: number
    ) => {
      console.log(`Loading asset: ${url}: ${loaded}/${total}`);
    };

    this.loadingManager.onError = (url: string) => {
      console.error(`Error loading asset: ${url}`);
    };
  }
}
