import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Ammo from '../static/ammo';
import { RigidBody } from './Physics';
import { spawnObject } from './ObjectSpawner';


export default class Canvas {
    constructor() {
        this.rigidBodies = []
        this.count_ = 0
        this.countdown_ = 1.0
        this.previousRAF_ = null

        this.createRenderer()
        this.createScene()
        this.createCamera()
        this.createGeometry()
        this.createLights()
        this.startAmmo()

        this.onResize()

        this.controls = new OrbitControls(this.camera, this.renderer.domElement)

        this.controls.update()
    }

    createRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
        })
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping
        this.renderer.toneMappingExposure = 1
        this.renderer.setClearColor(0x000015)

        document.body.appendChild(this.renderer.domElement)

    }

    createScene() {
        this.scene = new THREE.Scene()
    }

    createCamera() {
        const fov = 60;
        const aspect = 1920 / 1080;
        const near = 1.0;
        const far = 1000.0;
        this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        this.camera.position.set(75, 20, 0);
    }

    createGeometry() {

    }

    createLights() {
        // Directional light
        const light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
        light.position.set(0, 100, 0); // Change light position
        light.color.setHSL(0.1, 1, 0.95);
        light.castShadow = true;
        light.shadow.mapSize.width = 2048;
        light.shadow.mapSize.height = 2048;
        light.shadow.camera.near = 0.1;
        light.shadow.camera.far = 1000; // Adjust far plane based on your scene dimensions
        light.shadow.camera.left = -200; // Adjust left and right planes to cover the scene
        light.shadow.camera.right = 200;
        light.shadow.camera.top = 200; // Adjust top and bottom planes to cover the scene
        light.shadow.camera.bottom = -200;
        this.scene.add(light);

        // Ambient light
        const amLight = new THREE.AmbientLight(0xFFFFFF, 0.5);
        this.scene.add(amLight);

    }

    startAmmo() {
        Ammo().then((Ammo) => {
            Ammo = Ammo
            this.ammoClone = Ammo
            this.createAmmo()
        })
    }

    createAmmo(Ammo = this.ammoClone) {
        this.tempTransform = new Ammo.btTransform()

        this.setupPhysicsWorld(Ammo)
        this.createPlane(Ammo)
    }

    setupPhysicsWorld(Ammo = this.ammoClone) {
        let collisionConfiguration_ = new Ammo.btDefaultCollisionConfiguration();
        let dispatcher_ = new Ammo.btCollisionDispatcher(collisionConfiguration_);
        let broadphase_ = new Ammo.btDbvtBroadphase();
        let solver_ = new Ammo.btSequentialImpulseConstraintSolver();
        this.physicsWorld = new Ammo.btDiscreteDynamicsWorld(dispatcher_, broadphase_, solver_, collisionConfiguration_);
        this.physicsWorld.setGravity(new Ammo.btVector3(0, -9.8, 0));
        console.log('phyics world init')
    }

    // tao map
    createPlane(Ammo = this.ammoClone) {
        const rb = new RigidBody(this.ammoClone, THREE, this.scene, true);
        // parameters to create a box: 
        // (width, height, depth), mass, position(x,y,z), quaternion(x,y,z,w)
        rb.createBox(new THREE.Vector3(200, 1, 200), 0, new THREE.Vector3(0, 0, 0), new THREE.Vector4(0, 0, 0, 1), '#6eeb34');
        this.physicsWorld.addRigidBody(rb.body_);


        // Create platforms
        const platformHeight = 10;
        const platformDepth = 10;
        const platformWidth = 40;

        // Platform 1
        const platform1 = new RigidBody(this.ammoClone, THREE, this.scene, '#1240a3');
        platform1.createBox(new THREE.Vector3(platformWidth, platformHeight, platformDepth), 0, new THREE.Vector3(-60, platformHeight * 0.5, 0), new THREE.Vector4(0, 0, 0, 1),'#d1175b');
        this.physicsWorld.addRigidBody(platform1.body_);

        // Platform 2
        const platform2 = new RigidBody(this.ammoClone, THREE, this.scene, '#9e12a3');
        platform2.createBox(new THREE.Vector3(platformWidth, platformHeight, platformDepth), 0, new THREE.Vector3(0, platformHeight * 1.5, 40), new THREE.Vector4(0, 0, 0, 1),'#4c02eb');
        this.physicsWorld.addRigidBody(platform2.body_);

        // Platform 3
        const platform3 = new RigidBody(this.ammoClone, THREE, this.scene, '#ebb800');
        platform3.createBox(new THREE.Vector3(platformWidth, platformHeight, platformDepth), 0, new THREE.Vector3(60, platformHeight * 2.5, -20), new THREE.Vector4(0, 0, 0, 1),'#d0f502');
        this.physicsWorld.addRigidBody(platform3.body_);

        // Platform 4
        const platform4 = new RigidBody(this.ammoClone, THREE, this.scene, '#ebb800');
        platform3.createBox(new THREE.Vector3(platformWidth, platformHeight, platformDepth), 0, new THREE.Vector3(0, 0, 0), new THREE.Vector4(0, 0, 0, 1),'#d0f502');
        this.physicsWorld.addRigidBody(platform3.body_);

    }

    onResize() {
        const windowWidth = window.innerWidth
        const windowHeight = window.innerHeight

        this.camera.aspect = windowWidth / windowHeight
        this.camera.updateProjectionMatrix()

        this.renderer.setSize(windowWidth, windowHeight)
    }

    // ham de update render
    raf_() {
        requestAnimationFrame((t) => {
            if (this.previousRAF_ === null) {
                this.previousRAF_ = t;
            }

            this.step_(t - this.previousRAF_);
            this.renderer.render(this.scene, this.camera);
            this.raf_();
            this.previousRAF_ = t;
        });
    }

    // generate boxes
    spawn_() {
        const rb = new RigidBody(this.ammoClone, THREE, this.scene);
        rb.createBox(new THREE.Vector3(2, 1, 3), 10, new THREE.Vector3(0, 10, 0), new THREE.Vector4(0, 0, 0, 1));
        this.physicsWorld.addRigidBody(rb.body_);
        this.rigidBodies.push(rb);
    }

    step_(timeElapsed) {
        const timeElapsedS = timeElapsed * 0.001;

        this.countdown_ -= timeElapsedS;

        // generate boxes
        if (this.physicsWorld && this.countdown_ < 0 && this.count_ < 100) {
            this.countdown_ = 0.25;
            this.count_ += 1;
            this.spawn_();
        }

        //update physics, syncing rigid bodies
        if (this.physicsWorld) this.physicsWorld.stepSimulation(timeElapsedS, 10);
        for (let i = 0; i < this.rigidBodies.length; ++i) {
            this.rigidBodies[i].motionState_.getWorldTransform(this.tempTransform);
            const pos = this.tempTransform.getOrigin();
            const quat = this.tempTransform.getRotation();
            const pos3 = new THREE.Vector3(pos.x(), pos.y(), pos.z());
            const quat3 = new THREE.Quaternion(quat.x(), quat.y(), quat.z(), quat.w());

            this.rigidBodies[i].mesh.position.copy(pos3);
            this.rigidBodies[i].mesh.quaternion.copy(quat3);
        }

    }
}

let canvas = new Canvas()
canvas.raf_()