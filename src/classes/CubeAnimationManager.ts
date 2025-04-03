import { Easing, Group, Tween } from '@tweenjs/tween.js';
import * as THREE from 'three';

interface ExplodeAnimationOptions {
  meshes: THREE.Mesh[];
  onComplete?: () => void;
}

interface CollectAnimationOptions extends ExplodeAnimationOptions {
  initialPositions: THREE.Vector3[];
}

export class CubeAnimationManager {
  private readonly EXPLOSION_FORCE_MULTIPLIER = 3.5;
  private readonly EXPLOSION_OFFSET_MULTIPLIER = 0.7;
  private readonly BASE_ROTATION_SPEED = 1;
  private readonly ANIMATION_DURATION = 1500;
  private readonly DELAY_PER_DISTANCE = 10;
  private readonly RANDOM_FACTOR_MULTIPLIER = 0.2;
  private readonly CENTER_ANIMATION = new THREE.Vector3(0, 0, 0);

  private sceneAnimationGroup: Group;

  private completedAnimations = 0;

  constructor(animationGroup: Group) {
    this.sceneAnimationGroup = animationGroup;
  }

  public explodeAnimation({ meshes, onComplete }: ExplodeAnimationOptions) {
    this.completedAnimations = 0;

    meshes.forEach(mesh => {
      const {
        position: targetPosition,
        rotation: targetRotation,
        delay: explodeDelay,
      } = this.calculateExplosionAnimation(mesh);

      const explode = new Tween(mesh.position, this.sceneAnimationGroup)
        .to(targetPosition, this.ANIMATION_DURATION)
        .delay(explodeDelay)
        .easing(Easing.Quintic.Out)
        .onStart(() => {
          new Tween(mesh.rotation, this.sceneAnimationGroup)
            .to(targetRotation, this.ANIMATION_DURATION)
            .easing(Easing.Quintic.Out)
            .start();
        })
        .start();

      explode.onComplete(() => {
        this.completedAnimations++;
        if (this.completedAnimations === meshes.length && onComplete) {
          onComplete();
        }
      });
    });
  }

  public collectAnimation({
    meshes,
    initialPositions,
    onComplete,
  }: CollectAnimationOptions) {
    this.completedAnimations = 0;

    meshes.forEach((mesh, index) => {
      const collect = new Tween(mesh.position, this.sceneAnimationGroup)
        .to(initialPositions[index], this.ANIMATION_DURATION)
        .easing(Easing.Quintic.In)
        .onStart(() => {
          new Tween(mesh.rotation, this.sceneAnimationGroup)
            .to(new THREE.Vector3(0, 0, 0), this.ANIMATION_DURATION)
            .easing(Easing.Quintic.In)
            .start();
        })
        .start();

      collect.onComplete(() => {
        this.completedAnimations++;
        if (this.completedAnimations === meshes.length && onComplete) {
          onComplete();
        }
      });
    });
  }

  private calculateExplosionAnimation(mesh: THREE.Mesh): {
    position: THREE.Vector3;
    rotation: THREE.Vector3;
    delay: number;
  } {
    const initialPosition = mesh.position.clone();

    // Calculate the direction vector from the center to the mesh
    const direction = initialPosition.sub(this.CENTER_ANIMATION);
    const baseDistance = direction.length() ? direction.length() : 1;
    direction.normalize();

    // Add a random offset to the direction
    const randomOffset = new THREE.Vector3(
      (Math.random() * 2 - 1) * this.EXPLOSION_OFFSET_MULTIPLIER,
      (Math.random() * 2 - 1) * this.EXPLOSION_OFFSET_MULTIPLIER,
      (Math.random() * 2 - 1) * this.EXPLOSION_OFFSET_MULTIPLIER
    );

    // Combine normalized direction and random offset
    const finalDirection = direction.add(randomOffset).normalize();

    // Calculate the explosion distance with random variation
    const randomDistanceFactor =
      Math.random() * (this.RANDOM_FACTOR_MULTIPLIER * 2) -
      this.RANDOM_FACTOR_MULTIPLIER;
    const explosionDistance =
      baseDistance *
      this.EXPLOSION_FORCE_MULTIPLIER *
      (1 + randomDistanceFactor);

    // Calculate the final position
    const targetPosition = this.CENTER_ANIMATION.clone().add(
      finalDirection.multiplyScalar(explosionDistance)
    );

    // Calculate the rotation speed
    const randomRotationFactor =
      this.RANDOM_FACTOR_MULTIPLIER +
      Math.random() * this.RANDOM_FACTOR_MULTIPLIER;
    const rotationSpeed =
      this.BASE_ROTATION_SPEED *
      Math.pow(explosionDistance / baseDistance, 2) *
      randomRotationFactor;
    const targetRotation = new THREE.Vector3(
      Math.random() * Math.PI * rotationSpeed,
      Math.random() * Math.PI * rotationSpeed,
      Math.random() * Math.PI * rotationSpeed
    );

    const explosionDelay = baseDistance * this.DELAY_PER_DISTANCE;

    return {
      position: targetPosition,
      rotation: targetRotation,
      delay: explosionDelay,
    };
  }
}
