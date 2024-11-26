

class ThreeDViewer {
    constructor() {
        this.container = document.getElementById('canvas-container');
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.container.clientWidth / this.container.clientHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.controls = null;
        this.currentModel = null;
        this.loader = new THREE.GLTFLoader();

        this.init();
        this.setupLights();
        this.animate();
    }

    init() {
        // Setup renderer
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.shadowMap.enabled = true;
        this.container.appendChild(this.renderer.domElement);

        // Setup camera
        this.camera.position.set(0, 1, 5);

        // Setup controls
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.screenSpacePanning = false;
        this.controls.minDistance = 2;
        this.controls.maxDistance = 10;
        this.controls.maxPolarAngle = Math.PI / 2;//avoid scrolling through the bottom of the model

        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize(), false);
    }

    setupLights() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        // Hemisphere light
        const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.4);
        hemiLight.position.set(0, 20, 0);
        this.scene.add(hemiLight);

        // Directional light
        const dirLight = new THREE.DirectionalLight(0xffffff, 3);
        dirLight.position.set(5, 5, 5);
        dirLight.castShadow = true;
        dirLight.shadow.camera.top = 10;
        dirLight.shadow.camera.bottom = -10;
        dirLight.shadow.camera.left = -10;
        dirLight.shadow.camera.right = 10;
        dirLight.shadow.camera.near = 0.1;
        dirLight.shadow.camera.far = 40;
        this.scene.add(dirLight);
    }

    async loadModel(itemName) {
        console.log('loadModel called with:', itemName); // Debug log

        try {
            // Remove existing model if any
            if (this.currentModel) {
                this.scene.remove(this.currentModel);
                this.currentModel.traverse((child) => {
                    if (child.isMesh) {
                        child.geometry.dispose();
                        child.material.dispose();
                    }
                });
            }

            // Convert item name to filename format and create path
            const fileName = itemName.toLowerCase().replace(/\s+/g, '-');
            this.currentModelPath = `/models/${fileName}.glb`;

            // Debug logs
            console.log('Item name:', itemName);
            console.log('File name:', fileName);
            console.log('Model path:', this.currentModelPath);

            // Alert the model path
            //alert(`Attempting to load model:\nItem: ${itemName}\nPath: ${this.currentModelPath}`);

            // Load the GLB file
            const gltf = await this.loadGLTF(this.currentModelPath);
            this.currentModel = gltf.scene;

            // Setup the model
            this.currentModel.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            // Center and scale the model
            const box = new THREE.Box3().setFromObject(this.currentModel);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 2 / maxDim; // Scale to fit in a 2 unit sphere

            this.currentModel.position.copy(center).multiplyScalar(-1);
            this.currentModel.scale.setScalar(scale);

            // Add model to scene
            this.scene.add(this.currentModel);

            // Reset camera and controls
            this.resetView();

        } catch (error) {
            const errorMessage = `Error loading model:\nItem: ${itemName}\nPath: ${this.currentModelPath}\nError: ${error.message}`;
            console.error(errorMessage);
            alert(errorMessage);
        }
    }


    loadGLTF(url) {
        console.log(`Attempting to load GLTF from URL: ${url}`); // Add debugging
        return new Promise((resolve, reject) => {
            this.loader.load(
                url,
                (gltf) => {
                    console.log('GLTF successfully loaded:', gltf); // Confirm success
                    resolve(gltf);
                },
                (xhr) => {
                    console.log(`Loading progress: ${(xhr.loaded / xhr.total) * 100}%`);
                },
                (error) => {
                    console.error('Error while loading GLTF:', error); // Log any errors
                    reject(error);
                }
            );
        });
    }



    resetView() {
        // Reset camera position
        this.camera.position.set(0, 1, 5);
        this.camera.lookAt(0, 0, 0);

        // Reset controls
        this.controls.reset();

        // Update controls target to center of model
        if (this.currentModel) {
            const box = new THREE.Box3().setFromObject(this.currentModel);
            const center = box.getCenter(new THREE.Vector3());
            this.controls.target.copy(center);
        }
    }

    onWindowResize() {
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}

// Add debug log for when the script loads
console.log('three-d-view.js loaded');

// Initialize 3D viewer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing ThreeDViewer');
    window.threeDViewer = new ThreeDViewer();
});
