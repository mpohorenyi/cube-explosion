export interface ExplodeAnimationSettings {
  explosionForceMultiplier: number;
  explosionOffsetMultiplier: number;
  baseRotationSpeed: number;
  animationDuration: number;
  delayPerDistance: number;
  randomFactorMultiplier: number;
  explosionCenter: { x: number; y: number; z: number };
}

export interface CollectAnimationSettings {
  animationDuration: number;
}
