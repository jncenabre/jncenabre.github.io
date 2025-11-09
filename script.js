import * as THREE from 'https://esm.run/three@0.160.1';
import { GLTFLoader } from 'https://esm.run/three@0.160.1/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://esm.run/three@0.160.1/examples/jsm/controls/OrbitControls.js';

const container = document.getElementById('viewer-container');
console.log("Viewer is running...");

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 100);
camera.position.set(40, 10, 50);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

// Lighting
scene.add(new THREE.AmbientLight(0xffffff, 0.7));
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enableZoom = true;

// Load model
const loader = new GLTFLoader();
let mixer;

loader.load('model/plane.glb', (gltf) => {
  const model = gltf.scene;
  scene.add(model);
  model.position.set(0, 0, 20);

  if (gltf.animations.length > 0) {
    mixer = new THREE.AnimationMixer(model);
    gltf.animations.forEach((clip) => mixer.clipAction(clip).play());
  }
}, undefined, (err) => console.error('Failed to load model:', err));

const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  if (mixer) mixer.update(delta);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// Handle resizing
window.addEventListener('resize', () => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
});

// ===== Interaction Prompt Logic =====
const prompt = document.getElementById('interaction-prompt');
let lastInteractionTime = Date.now();
let promptVisible = true;

// Show prompt after 5s of inactivity
function checkInactivity() {
  const now = Date.now();
  if (now - lastInteractionTime > 5000 && !promptVisible) {
    prompt.style.opacity = '1';
    promptVisible = true;
  }
  requestAnimationFrame(checkInactivity);
}
checkInactivity();

// Hide prompt on interaction
function hidePromptOnInteraction() {
  lastInteractionTime = Date.now();
  if (promptVisible) {
    prompt.style.opacity = '0';
    promptVisible = false;
  }
}

['mousedown', 'touchstart', 'wheel', 'keydown', 'mousemove'].forEach(event => {
  renderer.domElement.addEventListener(event, hidePromptOnInteraction);
});


  document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-links a[href^='#']");

    const observer = new IntersectionObserver(
      entries => {
        let currentSectionId = null;

        // Get the section that's most visible
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            currentSectionId = entry.target.id;
          }
        });

        // Update nav link classes
        if (currentSectionId) {
          navLinks.forEach(link => {
            const targetId = link.getAttribute("href");
            const section = document.querySelector(targetId);

            if (section && targetId === `#${currentSectionId}`) {
              link.classList.add("active");
            } else {
              link.classList.remove("active");
            }
          });
        }
      },
      {
        threshold: 0.6, // 60% of section must be visible
      }
    );

    // Observe each valid section
    sections.forEach(section => observer.observe(section));
  });
