let scene, camera, renderer, arSession, currentModel;

// Initialize Three.js and WebXR
function initAR() {
    // Dispose of the old renderer if it exists
    if (renderer) {
        renderer.dispose();
        document.getElementById('ar-container').removeChild(renderer.domElement);
    }

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
    if (arSession) {
        // End the previous AR session if it exists
        arSession.end();
    }

    arSession = await navigator.xr.requestSession('immersive-ar');
    renderer.xr.setSession(arSession);

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
    // Ensure the scene is initialized
    if (!scene) {
        console.error("Scene is not initialized. Call initAR() first.");
        return;
    }

    // Clear previous model
    if (currentModel) {
        scene.remove(currentModel);
    }

    // Load the 3D model
    const loader = new THREE.GLTFLoader();
    loader.load(`models/${modelName}.glb`, (gltf) => {
        currentModel = gltf.scene;
        currentModel.position.set(0, 0, -0.5); // Position the model in front of the camera
        scene.add(currentModel);
    }, undefined, (error) => {
        console.error("Error loading 3D model:", error);
    });
}

// Handle menu item clicks
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', () => {
        const modelName = item.getAttribute('data-model');
        initAR(); // Initialize AR
        loadARModel(modelName); // Load the selected model
    });
});

// Handle window resize
window.addEventListener('resize', () => {
    if (camera) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }
    if (renderer) {
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
});

// Clean up when leaving the page
window.addEventListener('beforeunload', () => {
    if (renderer) {
        renderer.dispose();
    }
    if (arSession) {
        arSession.end();
    }
});