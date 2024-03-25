// ThreeSetup.js
import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function setupThree() {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 20, 0);
  controls.update();

  return { renderer };
}

export function createScene() {
  const scene = new THREE.Scene();
  let light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
  light.position.set(20, 100, 10);
  light.target.position.set(0, 0, 0);
  light.castShadow = true;
  light.shadow.bias = -0.001;
  light.shadow.mapSize.width = 2048;
  light.shadow.mapSize.height = 2048;
  light.shadow.camera.near = 0.1;
  light.shadow.camera.far = 500.0;
  light.shadow.camera.near = 0.5;
  light.shadow.camera.far = 500.0;
  light.shadow.camera.left = 100;
  light.shadow.camera.right = -100;
  light.shadow.camera.top = 100;
  light.shadow.camera.bottom = -100;
  this.scene_.add(light);

  const controls = new OrbitControls(
    this.camera_, this.threejs_.domElement);
  controls.target.set(0, 20, 0);
  controls.update();

  // const loader = new THREE.CubeTextureLoader();
  // const texture = loader.load([
  //   './resources/posx.jpg',
  //   './resources/negx.jpg',
  //   './resources/posy.jpg',
  //   './resources/negy.jpg',
  //   './resources/posz.jpg',
  //   './resources/negz.jpg',
  // ]);
  // this.scene_.background = texture;
  light = new THREE.AmbientLight(0x101010);
  this.scene_.add(light);
  return { scene };
}

export function createCamera() {
  const fov = 60;
  const aspect = window.innerWidth / window.innerHeight;
  const near = 1.0;
  const far = 1000.0;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(75, 20, 0);
  return { camera };
}

// You can add more setup functions for lights, controls, etc.
