import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import * as support from './support';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


//scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();


renderer.setSize(window.innerWidth, window.innerHeight);
// Thiết lập màu nền của renderer thành màu trắng
renderer.setClearColor(0xffffff);

// Hoặc nếu bạn muốn sử dụng màu nền gradient:
// renderer.setClearColor(new THREE.Color(0xffffff));

// Nếu bạn cần sử dụng alpha (độ trong suốt) cho màu nền:
// renderer.setClearColor(0xffffff, 1); // Trong đó 1 là giá trị alpha (0 đến 1)

// Lưu ý rằng màu nền cũng có thể được thiết lập thông qua CSS
// renderer.domElement.style.backgroundColor = 'white';



document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
// scene.add( cube );

//--------------------------------- Environment------------------------------


// Tạo một mặt phẳng đơn giản cho mặt đất
var groundGeometry = new THREE.PlaneGeometry(10, 10);
var groundMaterial = new THREE.MeshBasicMaterial({ color: 0x999999 });
var ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = - Math.PI / 2; // Đặt mặt phẳng ngang với trục y
scene.add(ground);

// Tạo ánh sáng môi trường
var ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Màu trắng, cường độ 0.5
scene.add(ambientLight);

// Tạo ánh sáng mặt trời
var directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Màu trắng, cường độ 1
directionalLight.position.set(1, 1, 1).normalize(); // Đặt vị trí ánh sáng
scene.add(directionalLight);



// Tạo một instance của OrbitControls và gắn nó vào camera
var controls = new OrbitControls(camera, renderer.domElement);

// Tùy chỉnh các thuộc tính của controls (nếu cần)
controls.enableZoom = true;
controls.enablePan = true;
controls.enableRotate = true;

camera.position.z = 5;


support.m_LoadModelToScene(scene, '../00_assets/models/Rabbit.gltf');

//------------------------------------------------------------------------------------------------------------



//render scene


function animate() {
    requestAnimationFrame(animate);

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render(scene, camera);
}

if ( WebGL.isWebGLAvailable() ) {

	// Initiate function or other initializations here
	animate();

} else {

	const warning = WebGL.getWebGLErrorMessage();
	document.getElementById( 'container' ).appendChild( warning );

}