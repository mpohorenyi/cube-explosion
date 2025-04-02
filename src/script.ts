import * as THREE from 'three';

import { Scene } from './classes';

const scene = new Scene('.webgl');

const box = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 'green' });
const mesh = new THREE.Mesh(box, material);

scene.addMesh(mesh);
