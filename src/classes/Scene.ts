import { Group } from '@tweenjs/tween.js';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

interface Coordinates {
  x: number;
  y: number;
  z: number;
}

export class Scene {
  private canvas: HTMLCanvasElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;
  private animationGroup: Group;

  private sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    aspectRatio: window.innerWidth / window.innerHeight,
  };

  constructor(canvasSelector: string) {
    // Initialize Canvas
    this.canvas = document.querySelector(canvasSelector) as HTMLCanvasElement;
    if (!this.canvas) {
      throw new Error(
        `Canvas element with selector ${canvasSelector} not found`
      );
    }

    // Initialize Scene
    this.scene = new THREE.Scene();

    // Initialize Camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.sizes.aspectRatio,
      0.1,
      100
    );
    this.camera.position.set(3, 3, 3);
    this.scene.add(this.camera);

    // Initialize Renderer
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Initialize Controls
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enableDamping = true;

    // Initialize Tween Animation Group
    this.animationGroup = new Group();

    this.setupEventListeners();

    this.tick();
  }

  public addMesh(mesh: THREE.Mesh) {
    this.scene.add(mesh);
  }

  public clearMeshes() {
    const meshesToRemove: THREE.Mesh[] = [];

    this.scene.traverse(child => {
      if (child instanceof THREE.Mesh) {
        meshesToRemove.push(child);

        if (child.geometry) {
          child.geometry.dispose();
        }

        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(material => material.dispose());
          } else {
            child.material.dispose();
          }
        }
      }
    });

    for (const mesh of meshesToRemove) {
      mesh.removeFromParent();
    }
  }

  public setCameraPosition(position: Coordinates) {
    this.camera.position.set(position.x, position.y, position.z);
  }

  public setCameraLookAt(lookAt: Coordinates) {
    const targetVector = new THREE.Vector3(lookAt.x, lookAt.y, lookAt.z);

    this.camera.lookAt(targetVector);

    this.controls.target.copy(targetVector);

    this.controls.update();
  }

  private setupEventListeners() {
    window.addEventListener('resize', () => {
      this.sizes.width = window.innerWidth;
      this.sizes.height = window.innerHeight;
      this.sizes.aspectRatio = this.sizes.width / this.sizes.height;

      this.camera.aspect = this.sizes.aspectRatio;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(this.sizes.width, this.sizes.height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    window.addEventListener('keydown', event => {
      if (event.code === 'KeyF') {
        const fullscreenElement =
          document.fullscreenElement ||
          (document as any).webkitFullscreenElement;

        if (!fullscreenElement) {
          if (this.canvas.requestFullscreen) {
            this.canvas.requestFullscreen();
          } else if ((this.canvas as any).webkitRequestFullscreen) {
            (this.canvas as any).webkitRequestFullscreen();
          }
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if ((document as any).webkitExitFullscreen) {
            (document as any).webkitExitFullscreen();
          }
        }
      }
    });
  }

  private tick() {
    this.animationGroup.update();

    this.controls.update();

    this.renderer.render(this.scene, this.camera);

    window.requestAnimationFrame(this.tick.bind(this));
  }
}
