import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export function m_LoadModelToScene(scene, modelPath) {
    // Tạo một loader để tải mô hình từ tệp glTF
    var loader = new GLTFLoader();

    // Tải mô hình từ tệp glTF với đường dẫn tuyệt đối hoặc tương đối
    loader.load(modelPath, function (gltf) {
        // Lấy mesh từ glTF
        var model = gltf.scene;

        // Đặt vị trí mô hình tại (0, 0, 0)
        model.position.set(0, 0, 0);

        // Thêm mô hình vào scene của bạn
        scene.add(model);
    });
}