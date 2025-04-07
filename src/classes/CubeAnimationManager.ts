import { Easing, Group, Tween } from '@tweenjs/tween.js';
import * as THREE from 'three';

import { CollectAnimationSettings, ExplodeAnimationSettings } from './types';

interface BaseAnimationOptions {
  meshes: THREE.Mesh[];
  onComplete?: () => void;
}

interface ExplodeAnimationOptions extends BaseAnimationOptions {
  animationSettings: ExplodeAnimationSettings;
}

interface CollectAnimationOptions extends BaseAnimationOptions {
  initialPositions: THREE.Vector3[];
  animationSettings: CollectAnimationSettings;
}

export class CubeAnimationManager {
  private sceneAnimationGroup: Group;

  private completedAnimations = 0;

  constructor(animationGroup: Group) {
    this.sceneAnimationGroup = animationGroup;
  }

  public explodeAnimation({ meshes, animationSettings, onComplete }: ExplodeAnimationOptions) {
    this.completedAnimations = 0;

    meshes.forEach(mesh => {
      const {
        position: targetPosition,
        rotation: targetRotation,
        delay: explodeDelay,
      } = this.calculateExplosionAnimation(mesh, animationSettings);

      const explode = new Tween(mesh.position, this.sceneAnimationGroup)
        .to(targetPosition, animationSettings.animationDuration)
        .delay(explodeDelay)
        .easing(Easing.Quintic.Out)
        .onStart(() => {
          new Tween(mesh.rotation, this.sceneAnimationGroup)
            .to(targetRotation, animationSettings.animationDuration)
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
    animationSettings,
    onComplete,
  }: CollectAnimationOptions) {
    this.completedAnimations = 0;

    meshes.forEach((mesh, index) => {
      const collect = new Tween(mesh.position, this.sceneAnimationGroup)
        .to(initialPositions[index], animationSettings.animationDuration)
        .easing(Easing.Quintic.In)
        .onStart(() => {
          new Tween(mesh.rotation, this.sceneAnimationGroup)
            .to(new THREE.Vector3(0, 0, 0), animationSettings.animationDuration)
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

  private calculateExplosionAnimation(
    mesh: THREE.Mesh,
    animationSettings: ExplodeAnimationSettings
  ): {
    position: THREE.Vector3;
    rotation: THREE.Vector3;
    delay: number;
  } {
    const {
      explosionCenter,
      explosionForceMultiplier,
      explosionOffsetMultiplier,
      baseRotationSpeed,
      delayPerDistance,
      randomFactorMultiplier,
    } = animationSettings;

    const initialPosition = mesh.position.clone();

    const centerVector = new THREE.Vector3(explosionCenter.x, explosionCenter.y, explosionCenter.z);

    // Calculate the direction vector from the center to the mesh
    const direction = initialPosition.sub(centerVector);
    const baseDistance = direction.length() ? direction.length() : 1;
    direction.normalize();

    // Add a random offset to the direction
    const randomOffset = new THREE.Vector3(
      (Math.random() * 2 - 1) * explosionOffsetMultiplier,
      (Math.random() * 2 - 1) * explosionOffsetMultiplier,
      (Math.random() * 2 - 1) * explosionOffsetMultiplier
    );

    // Combine normalized direction and random offset
    const finalDirection = direction.add(randomOffset).normalize();

    // Calculate the explosion distance with random variation
    const randomDistanceFactor =
      Math.random() * (randomFactorMultiplier * 2) - randomFactorMultiplier;
    const explosionDistance = baseDistance * explosionForceMultiplier * (1 + randomDistanceFactor);

    // Calculate the final position
    const targetPosition = centerVector
      .clone()
      .add(finalDirection.multiplyScalar(explosionDistance));

    // Calculate the rotation speed
    const randomRotationFactor = randomFactorMultiplier + Math.random() * randomFactorMultiplier;
    const rotationSpeed =
      baseRotationSpeed * Math.pow(explosionDistance / baseDistance, 2) * randomRotationFactor;
    const targetRotation = new THREE.Vector3(
      Math.random() * Math.PI * rotationSpeed,
      Math.random() * Math.PI * rotationSpeed,
      Math.random() * Math.PI * rotationSpeed
    );

    const explosionDelay = baseDistance * delayPerDistance;

    return {
      position: targetPosition,
      rotation: targetRotation,
      delay: explosionDelay,
    };
  }
}
