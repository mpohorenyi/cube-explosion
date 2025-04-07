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
  ): THREE.Mesh[] {
    if (!textures || textures.length === 0) {
      console.warn('No textures provided for cube generation');
    }

    this.meshes = [];
    this.initialPositions = [];

    const offsetX = (sizeX - 1) / 2;
    const offsetY = (sizeY - 1) / 2;
    const offsetZ = (sizeZ - 1) / 2;
    const tempPosition = new THREE.Vector3();

    const materials = this.createMaterials(textures);

    for (let x = 0; x < sizeX; x++) {
      for (let y = 0; y < sizeY; y++) {
        for (let z = 0; z < sizeZ; z++) {
          tempPosition.set(x - offsetX, y - offsetY, z - offsetZ);

          const mesh = this.createRandomMesh(tempPosition, materials);

          this.meshes.push(mesh);
          this.initialPositions.push(tempPosition.clone());
        }
      }
    }

    return [...this.meshes];
  }

  private geometries: THREE.BufferGeometry[] = [
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.CylinderGeometry(0.5, 0.5, 1, 16),
  ];

  private createMaterials(textures: THREE.Texture[]): THREE.Material[] {
    return Array.from({ length: textures.length }, (_, index) => {
      return new THREE.MeshBasicMaterial({
        map: textures[index],
      });
    });
  }

  private createRandomMesh(
    position: THREE.Vector3,
    materials: THREE.Material[]
  ): THREE.Mesh {
    const randomGeometryIndex = Math.floor(
      Math.random() * this.geometries.length
    );
    const randomMaterialIndex = Math.floor(Math.random() * materials.length);

    const mesh = new THREE.Mesh(
      this.geometries[randomGeometryIndex],
      materials[randomMaterialIndex]
    );

    mesh.position.copy(position);

    return mesh;
  }
}
