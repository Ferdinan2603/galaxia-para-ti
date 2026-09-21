// --- 1. CONFIGURACIÓN DEL ESCENARIO 3D ---
const container = document.getElementById('webgl-container');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x020208);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 22);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
// --- CÁMARA CINEMATOGRÁFICA DE ENTRADA ---
controls.enableRotate = true;
controls.enableZoom = true;
controls.enablePan = false;

controls.minDistance = 8;
controls.maxDistance = 50;

controls.enabled = false;



const posicionFinalCamara = new THREE.Vector3(0, 0, 22);
const posicionInicialCamara = new THREE.Vector3(0, 3, 32);

camera.position.copy(posicionInicialCamara);

let tiempoInicioCamara = Date.now();
const duracionCamara = 5000; // 5 segundos

// Luz ambiental
const ambientLight = new THREE.AmbientLight(0xffea00, 1.5);
scene.add(ambientLight);


// --- 2. POLVO ESTELAR DE FONDO ---
const particlesCount = 500;
const particlesGeometry = new THREE.BufferGeometry();
const posArray = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 60;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.3,
    color: 0xffea00,
    transparent: true,
    opacity: 0.7
});

const polvoEstelar = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(polvoEstelar);

// --- GIRASOLES EMOJI COMO ESTRELLAS 🌻 ---

const canvasGirasol = document.createElement("canvas");
canvasGirasol.width = 128;
canvasGirasol.height = 128;

const ctxGirasol = canvasGirasol.getContext("2d");

ctxGirasol.clearRect(
    0,
    0,
    canvasGirasol.width,
    canvasGirasol.height
);

ctxGirasol.font = "80px Arial";
ctxGirasol.textAlign = "center";
ctxGirasol.textBaseline = "middle";

ctxGirasol.fillText(
    "🌻",
    canvasGirasol.width / 2,
    canvasGirasol.height / 2
);

const texturaGirasol = new THREE.CanvasTexture(
    canvasGirasol
);

const materialGirasol = new THREE.SpriteMaterial({
    map: texturaGirasol,
    transparent: true,
    depthWrite: false
});

const girasoles = new THREE.Group();

for (let i = 0; i < 200; i++) {

    const girasol = new THREE.Sprite(
        materialGirasol.clone()
    );

    girasol.position.x =
        (Math.random() - 0.5) * 45;

    girasol.position.y =
        (Math.random() - 0.5) * 25;

    girasol.position.z =
        (Math.random() - 0.5) * 35;

    const escala =
        0.35 + Math.random() * 0.55;

    girasol.scale.set(
        escala,
        escala,
        1
    );

    girasoles.add(girasol);
}

scene.add(girasoles);


// --- TEXTO 3D "TE AMO" ---
let textoTeAmo = null;
const fontLoader = new THREE.FontLoader();

fontLoader.load(
    'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',
    function(font) {

        const textoGeometry = new THREE.TextGeometry(
            'Te Amo',
            {
                font: font,
                size: 1.5,
                height: 0.15,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelSegments: 3
            }
        );

        textoGeometry.center();

        const textoMaterial = new THREE.MeshStandardMaterial({
            color: 0xffeb3b,
            emissive: 0xffaa00,
            emissiveIntensity: 0.8,
            metalness: 0.2,
            roughness: 0.3
        });

         textoTeAmo = new THREE.Mesh(
            textoGeometry,
            textoMaterial
        );
        textoTeAmo.userData.escalaInicial = 1;
        textoTeAmo.position.set(0, 0, 5);

        scene.add(textoTeAmo);
    }
);

// --- 10. PÉTALOS FLOTANTES ---

const petalosCantidad = 80;

const petalosGeometry = new THREE.BufferGeometry();
const petalosPositions = new Float32Array(petalosCantidad * 3);

for (let i = 0; i < petalosCantidad; i++) {

    petalosPositions[i * 3] =
        (Math.random() - 0.5) * 30;

    petalosPositions[i * 3 + 1] =
        (Math.random() - 0.5) * 20;

    petalosPositions[i * 3 + 2] =
        (Math.random() - 0.5) * 20;
}

petalosGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(petalosPositions, 3)
);

const petalosMaterial = new THREE.PointsMaterial({
    color: 0xffd700,
    size: 0.12,
    transparent: true,
    opacity: 0.9
});

const petalos = new THREE.Points(
    petalosGeometry,
    petalosMaterial
);

scene.add(petalos);

// --- 3. FLORES 3D INTERACTIVAS ---

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const objetosInteractivos = [];
let florSeleccionada = null;
const loader = new THREE.GLTFLoader();

loader.setMeshoptDecoder(MeshoptDecoder);

const datosFlores = [
    {
        mensaje: "Eres mi cielo,mi dulzura y mi razon de esxistir☀️",
        img: "fotos/WhatsApp Image 2026-09-20 at 6.57.43 AM.jpeg",
        modelo: 1
    },
    {
        mensaje: "Amor de mi vida siempre juntos 💛",
        img: "fotos/WhatsApp Image 2026-09-20 at 6.57.42 AM.jpeg",
        modelo: 2
    },
    {
        mensaje: "Me encantas eres mi tesoro 🌻",
        img: "fotos/WhatsApp Image 2026-09-20 at 7.00.38 AM.jpeg",
        modelo: 1
    },
    {
        mensaje: "prometo amarte siempre  ✨",
        img: "fotos/WhatsApp Image 2026-09-20 at 6.57.41 AM.jpeg",
        modelo: 2
    },
    {
        mensaje: "Te amo con el alma gracias por llegar a mi vida 💐",
        img: "fotos/WhatsApp Image 2026-09-20 at 7.03.09 AM.jpeg",
        modelo: 1
    }
];
datosFlores.forEach((d, index) => {

        const angulo = (index / datosFlores.length) * Math.PI * 2;

    const radioX = 10;
    const radioZ = 7;

    d.x = Math.cos(angulo) * radioX;
    d.y = 0;
    d.z = 5 + Math.sin(angulo) * radioZ;

    const rutaModelo = d.modelo === 1
        ? 'modelos/3dad3ccb-c710-4c73-954b-34b108727597_620af5ca200c26a6ae7b84309b7fd842.glb'
        : 'modelos/23047e7c-adf1-4535-b55f-1f328c3f2077_2cf9df919b017c202e64d0fe081773a3.glb';

    loader.load(
        rutaModelo,

        function(gltf) {

            const flor = gltf.scene;

            flor.scale.set(3, 3, 3);

            flor.position.set(d.x, d.y, d.z);

            flor.userData = {
    mensaje: d.mensaje,
    img: d.img,
    posicionInicial: {
        x: d.x,
        y: d.y,
        z: d.z
    },
    offset: index
};
const luzFlor = new THREE.PointLight(0xffd700, 1.2, 4);
luzFlor.position.set(0, 0, 1);

flor.add(luzFlor);

const haloGeometry = new THREE.SphereGeometry(1.2, 10, 10);

const haloMaterial = new THREE.MeshBasicMaterial({
    color: 0xffd700,
    transparent: true,
    opacity: 0.01,
    depthWrite: false
});

const halo = new THREE.Mesh(
    haloGeometry,
    haloMaterial
);

flor.add(halo);

            scene.add(flor);

            objetosInteractivos.push(flor);
        },

        undefined,

        function(error) {
            console.error("Error cargando la flor:", error);
        }
    );
});

// --- 4. INTERACTIVIDAD (CLIC EN LAS FLORES) ---

const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal-img');
const modalTexto = document.getElementById('modal-texto');
const botonCerrar = document.getElementById('cerrar');

window.addEventListener('click', (event) => {

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(
        objetosInteractivos,
        true
    );

    if (intersects.length > 0) {

        let objetoSeleccionado = intersects[0].object;

        // Buscar el objeto principal de la flor
        while (
            objetoSeleccionado.parent &&
            !objetoSeleccionado.userData.mensaje
        ) {
            objetoSeleccionado = objetoSeleccionado.parent;
        }

        if (objetoSeleccionado.userData.mensaje) {

            modalTexto.textContent =
                objetoSeleccionado.userData.mensaje;

            modalImg.src =
                objetoSeleccionado.userData.img;

            modal.classList.remove('oculto');
            crearCorazones(objetoSeleccionado);
        }
    }
});

botonCerrar.addEventListener('click', () => {
    modal.classList.add('oculto');
});
// --- EFECTO HOVER SOBRE LAS FLORES ---

window.addEventListener('mousemove', (event) => {

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(
        objetosInteractivos,
        true
    );

    let nuevaFlor = null;

    if (intersects.length > 0) {

        let objeto = intersects[0].object;

        while (
            objeto.parent &&
            !objeto.userData.mensaje
        ) {
            objeto = objeto.parent;
        }

        if (objeto.userData.mensaje) {
            nuevaFlor = objeto;
        }
    }

    if (florSeleccionada !== nuevaFlor) {

        if (florSeleccionada) {
            florSeleccionada.userData.hover = false;
        }

        florSeleccionada = nuevaFlor;

        if (florSeleccionada) {
            florSeleccionada.userData.hover = true;
        }
    }
});

// --- 5. ANIMACIÓN FLUÍDA ---
function animate() {
    requestAnimationFrame(animate);

    // --- MOVIMIENTO CINEMATOGRÁFICO DE ENTRADA ---
    const tiempoActual = Date.now();
    const tiempoTranscurrido = tiempoActual - tiempoInicioCamara;

    if (tiempoTranscurrido < duracionCamara) {

        let progreso = tiempoTranscurrido / duracionCamara;

        // Suavizado de movimiento
        progreso = progreso * progreso * (3 - 2 * progreso);

        camera.position.lerpVectors(
            posicionInicialCamara,
            posicionFinalCamara,
            progreso
        );

        // La cámara mira hacia el centro durante la introducción
        camera.lookAt(0, 0, 5);

    } else {

        // La animación terminó.
        // Activamos los controles y NO volvemos a modificar
        // la posición de la cámara.
        controls.enabled = true;
    }

    polvoEstelar.rotation.y += 0.001;
    girasoles.rotation.y += 0.0005;
girasoles.rotation.x += 0.0002;

    if (textoTeAmo) {
        const latido =
            1 + Math.sin(Date.now() * 0.003) * 0.03;

        textoTeAmo.scale.set(
            latido,
            latido,
            latido
        );
    }

    petalos.rotation.y += 0.001;
    petalos.rotation.x += 0.0005;

    objetosInteractivos.forEach((flor) => {
        if (flor.userData.posicionInicial) {

            flor.position.y =
                flor.userData.posicionInicial.y +
                Math.sin(
                    Date.now() * 0.002 +
                    flor.userData.offset
                ) * 0.15;

            flor.rotation.y += 0.003;
            flor.rotation.x += 0.001;

            const escalaObjetivo =
                flor.userData.hover ? 3.3 : 3;

            const escalaActual = flor.scale.x;

            const nuevaEscala =
                escalaActual +
                (escalaObjetivo - escalaActual) * 0.08;

            flor.scale.set(
                nuevaEscala,
                nuevaEscala,
                nuevaEscala
            );
        }
    });

    // Actualizar controles de cámara
    controls.update();

    renderer.render(scene, camera);
}
animate();

// Ajustar tamaño al redimensionar
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- 11. EFECTO DE CORAZONES AL HACER CLIC ---

function crearCorazones(flor) {

    for (let i = 0; i < 12; i++) {

        const corazon = document.createElement('div');

        corazon.innerHTML = '❤️';

        corazon.style.position = 'fixed';
        corazon.style.fontSize = '20px';
        corazon.style.pointerEvents = 'none';
        corazon.style.zIndex = '20';

        const posicion = flor.position.clone();

        posicion.project(camera);

        const x = (posicion.x * 0.5 + 0.5) * window.innerWidth;
        const y = (-posicion.y * 0.5 + 0.5) * window.innerHeight;

        corazon.style.left = x + 'px';
        corazon.style.top = y + 'px';

        document.body.appendChild(corazon);

        const movimientoX =
            (Math.random() - 0.5) * 200;

        const movimientoY =
            -50 - Math.random() * 150;

        corazon.animate(
            [
                {
                    transform: 'translate(-50%, -50%) scale(0.5)',
                    opacity: 1
                },
                {
                    transform:
                        `translate(
                            calc(-50% + ${movimientoX}px),
                            calc(-50% + ${movimientoY}px)
                        ) scale(1.5)`,
                    opacity: 0
                }
            ],
            {
                duration: 1500,
                easing: 'ease-out'
            }
        );

        setTimeout(() => {
            corazon.remove();
        }, 1500);
    }
}
// --- MÚSICA CON FADE-IN Y FADE-OUT ---
const musica = document.getElementById('musica');
const botonMusica = document.getElementById('boton-musica');

musica.volume = 0;

let fadeInterval = null;

botonMusica.addEventListener('click', () => {

    // REPRODUCIR
    if (musica.paused) {

        // Cancelar cualquier fade anterior
        clearInterval(fadeInterval);

        musica.volume = 0;

        musica.play();

        botonMusica.textContent = '⏸️ Pausar canción';

        // FADE-IN
        let volumen = 0;

        fadeInterval = setInterval(() => {

            volumen += 0.02;

            if (volumen >= 1) {
                volumen = 1;
                clearInterval(fadeInterval);
            }

            musica.volume = volumen;

        }, 100);

    }

    // PAUSAR
    else {

        // Cancelar cualquier fade anterior
        clearInterval(fadeInterval);

        // FADE-OUT
        let volumen = musica.volume;

        fadeInterval = setInterval(() => {

            volumen -= 0.02;

            if (volumen <= 0) {

                volumen = 0;

                musica.volume = 0;

                clearInterval(fadeInterval);

                musica.pause();

            }

            musica.volume = volumen;

        }, 100);

        botonMusica.textContent = '🎵 Reproducir canción';
    }

});

// =========================================
// CARTA DE AMOR DE INICIO
// =========================================

const cartaInicio = document.getElementById('carta-inicio');
const botonOK = document.getElementById('boton-ok');

botonOK.addEventListener('click', () => {

    cartaInicio.classList.add('ocultar-carta');

});
// ==========================================
// TOQUE EN CELULAR PARA SELECCIONAR FLORES
// ==========================================

renderer.domElement.addEventListener(
    "touchend",
    function (event) {

        // Evita que el toque genere otro clic automáticamente
        event.preventDefault();

        if (event.changedTouches.length === 0) {
            return;
        }

        const touch = event.changedTouches[0];

        // Convertimos el toque en un clic
        const clicCelular = new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
            clientX: touch.clientX,
            clientY: touch.clientY
        });

        // Enviamos el clic al canvas de Three.js
        renderer.domElement.dispatchEvent(clicCelular);
    },
    {
        passive: false
    }
);
