import * as THREE from 'three';

export class CubeGenerator {
  private meshes: THREE.Mesh[] = [];
  private initialPositions: THREE.Vector3[] = [];

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
    if (!textures || textures.length === 0) {
      console.warn('No textures provided for cube generation');
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
