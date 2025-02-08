let scene, camera, renderer, arSession;

// Initialize Three.js and WebXR
function initAR() {
    // Set up the scene
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true; // Enable WebXR
    document.getElementById('ar-container').appendChild(renderer.domElement);

    // Add lighting
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1).normalize();
    scene.add(light);

    // Start the AR session
    startARSession();
}

// Start AR session
async function startARSession() {
    const session = await navigator.xr.requestSession('immersive-ar');
    renderer.xr.setSession(session);

    // Hide the menu and show the AR container
    document.getElementById('menu').style.display = 'none';
    document.getElementById('ar-container').style.display = 'block';

    // Render the scene
    renderer.setAnimationLoop(() => {
        renderer.render(scene, camera);
    });
}

// Load 3D model into the AR scene
function loadARModel(modelName) {
    // Clear previous model
    while (scene.children.length > 0) {
        scene.remove(scene.children[0]);
    }

    // Load the 3D model
    const loader = new THREE.GLTFLoader();
    loader.load(`models/${modelName}.glb`, (gltf) => {
        const model = gltf.scene;
        model.position.set(0, 0, -0.5); // Position the model in front of the camera
        scene.add(model);
    });
}

// Initialize AR when an item is clicked
function loadARModel(modelName) {
    initAR(); // Initialize AR
    loadARModel(modelName); // Load the selected model
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});