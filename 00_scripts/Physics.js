// Physics.js
import { Color } from 'three';
import Ammo from '../static/ammo';

export class RigidBody {
  constructor(Ammo, THREE,scene,isGround=false) {
    this.Ammo = Ammo
    this.THREE = THREE
    this.scene = scene
    this.mesh = null
    this.isGround = isGround
  }

  setRestitution(val) {
    this.body_.setRestitution(val);
  }

  setFriction(val) {
    this.body_.setFriction(val);
  }

  setRollingFriction(val) {
    this.body_.setRollingFriction(val);
  }

  createBox(size,mass, pos, quat,color='#ebb800') {

    const box = new this.THREE.Mesh(
      new this.THREE.BoxGeometry(size.x, size.y, size.z),
      new this.THREE.MeshStandardMaterial({
          color:color
      }));
    box.position.set(pos.x,pos.y,pos.z);
    box.quaternion.set(quat.x, quat.y, quat.z, quat.w);
    if(this.isGround == true){
      box.castShadow = false;
      box.receiveShadow = true;
    }else{
      box.castShadow = true;
      box.receiveShadow = true;
    }
    
    this.scene.add(box)
    this.mesh = box

    this.transform_ = new this.Ammo.btTransform();
    this.transform_.setIdentity();
    this.transform_.setOrigin(new this.Ammo.btVector3(pos.x, pos.y, pos.z));
    this.transform_.setRotation(new this.Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
    // sync physics world with other world
    this.motionState_ = new this.Ammo.btDefaultMotionState(this.transform_);

    const btSize = new this.Ammo.btVector3(size.x * 0.5, size.y * 0.5, size.z * 0.5);
    this.shape_ = new this.Ammo.btBoxShape(btSize);
    this.shape_.setMargin(0.05);

    this.inertia_ = new this.Ammo.btVector3(0, 0, 0);
    // mass = 0 means it is static(ground),
    if (mass > 0) {
      this.shape_.calculateLocalInertia(mass, this.inertia_);
    }

    this.info_ = new this.Ammo.btRigidBodyConstructionInfo(
        mass, this.motionState_, this.shape_, this.inertia_);
    this.body_ = new this.Ammo.btRigidBody(this.info_);

    this.setRestitution(0.125);
    this.setFriction(1);
    this.setRollingFriction(5);
    this.Ammo.destroy(btSize);
  }

}