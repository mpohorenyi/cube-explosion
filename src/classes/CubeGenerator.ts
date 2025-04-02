import * as THREE from 'three';

export class CubeGenerator {
  private meshes: THREE.Mesh[] = [];
  private initialPositions: THREE.Vector3[] = [];

  private MIN_SIZE = 1;
  private MAX_SIZE = 10;

  constructor() {}

  public getMeshes(): THREE.Mesh[] {
    return [...this.meshes];
  }

  public getInitialPositions(): THREE.Vector3[] {
    return [...this.initialPositions];
  }

  public generateCubeMeshes(
    sizeX: number,
    sizeY: number,
    sizeZ: number,
    textures: THREE.Texture[]
  ): { meshes: THREE.Mesh[]; initialPositions: THREE.Vector3[] } {
    if (
      sizeX > this.MAX_SIZE ||
      sizeY > this.MAX_SIZE ||
      sizeZ > this.MAX_SIZE
    ) {
      console.warn(`Size exceeds maximum allowed size: ${this.MAX_SIZE}`);
      return { meshes: this.meshes, initialPositions: this.initialPositions };
    }

    if (
      sizeX < this.MIN_SIZE ||
      sizeY < this.MIN_SIZE ||
      sizeZ < this.MIN_SIZE
    ) {
      console.warn(`Size is less than minimum allowed size: ${this.MIN_SIZE}`);
      return { meshes: this.meshes, initialPositions: this.initialPositions };
    }

    if (!textures || textures.length === 0) {
      console.warn('No textures provided for cube generation');
      return { meshes: this.meshes, initialPositions: this.initialPositions };
    }

    this.meshes = [];
    this.initialPositions = [];

    const offsetX = (sizeX - 1) / 2;
    const offsetY = (sizeY - 1) / 2;
    const offsetZ = (sizeZ - 1) / 2;
    const tempPosition = new THREE.Vector3();

    for (let x = 0; x < sizeX; x++) {
      for (let y = 0; y < sizeY; y++) {
        for (let z = 0; z < sizeZ; z++) {
          tempPosition.set(x - offsetX, y - offsetY, z - offsetZ);

          const mesh = this.createRandomMesh(tempPosition, textures);

          this.meshes.push(mesh);
          this.initialPositions.push(tempPosition.clone());
        }
      }
    }

    return {
      meshes: [...this.meshes],
      initialPositions: [...this.initialPositions],
    };
  }

  private geometryCreators = [
    () => new THREE.BoxGeometry(1, 1, 1),
    () => new THREE.SphereGeometry(0.5, 16, 16),
    () => new THREE.CylinderGeometry(0.5, 0.5, 1, 16),
  ];

  private createRandomMesh(
    position: THREE.Vector3,
    textures: THREE.Texture[]
  ): THREE.Mesh {
    const randomGeometryIndex = Math.floor(
      Math.random() * this.geometryCreators.length
    );
    const geometry = this.geometryCreators[randomGeometryIndex]();

    const randomTextureIndex = Math.floor(Math.random() * textures.length);
    const material = new THREE.MeshBasicMaterial({
      map: textures[randomTextureIndex],
    });

    const mesh = new THREE.Mesh(geometry, material);

    mesh.position.copy(position);

    return mesh;
  }
}
