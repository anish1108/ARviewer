let video = document.getElementById('camera');
let menu = document.getElementById('menu');

// Step 1: Access the camera and scan QR codes
async function startQRScanner() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        video.srcObject = stream;
        video.play();
        requestAnimationFrame(scanQR);
    } catch (err) {
        console.error("Camera access denied:", err);
    }
}

// Step 2: QR code scanning logic
function scanQR() {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const qrCode = jsQR(imageData.data, imageData.width, imageData.height);

    if (qrCode) {
        // Hide scanner and show menu
        document.getElementById('scanner-container').style.display = 'none';
        menu.style.display = 'block';
    }
    requestAnimationFrame(scanQR);
}

// Step 3: Load AR model using Three.js and WebXR
async function loadARModel(modelName) {
    // Initialize Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.xr.enabled = true; // Enable WebXR
    document.body.appendChild(renderer.domElement);

    // Load 3D model (replace with your own model URL)
    const loader = new THREE.GLTFLoader();
    loader.load(`models/${modelName}.glb`, (gltf) => {
        scene.add(gltf.scene);
    });

    // Enable AR
    renderer.xr.addEventListener('sessionstart', () => {
        // Place model where user taps
        renderer.domElement.addEventListener('click', (e) => {
            const position = new THREE.Vector3(0, 0, -0.5);
            scene.children[0].position.copy(position);
        });
    });

    // Start AR session
    const session = await navigator.xr.requestSession('immersive-ar');
    renderer.xr.setSession(session);
}

// Start the app
startQRScanner();