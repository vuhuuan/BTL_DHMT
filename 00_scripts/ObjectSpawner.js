// ObjectSpawner.js
import { RigidBody } from './Physics.js';

export function spawnObject(Ammo,scene, physicsWorld) {
  const scale = Math.random() * 20 + 4;
  const box = new THREE.Mesh(
    new THREE.BoxGeometry(scale, scale, scale),
    new THREE.MeshStandardMaterial({ color: 0x808080 })
  );
  // Set box position, quaternion, castShadow, receiveShadow, etc.

  const rb = new RigidBody(Ammo);
  // Initialize the rigid body with physics parameters
  physicsWorld.addRigidBody(rb.body_);

  scene.add(box);
}
