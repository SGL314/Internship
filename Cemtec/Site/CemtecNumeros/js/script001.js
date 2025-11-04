import * as THREE from 'https://unpkg.com/three@0.152.2/build/three.module.js';

// --- Cena, câmera, renderizador ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x070709);

const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
camera.position.z = 15;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
document.getElementById("spiral").appendChild(renderer.domElement);

// --- Luz ---
const light = new THREE.DirectionalLight(0xffffff, 1.2);
light.position.set(3, 5, 5);
scene.add(light);
scene.add(new THREE.AmbientLight(0x404040, 1));

// --- Criar cards ---

var cards = [];
const textCard = [["🏬 +20", "Empresa atendidas", "com soluções personalizadas"],
["🤝 15", "Serviços de alto", "impacto no mercado"],
["💵 +25 Milhões", "Em projetos executados", "com nossos parceiros"],
["🧾 +50", "Projetos estratégicos", "com o setor privado"],
["📜 +65", "Certificados emitidos", "com excelência técnica"]
];
const total = 5;
const images = [
  './data/1.png',
  './data/2.png',
  './data/3.png',
  './data/4.png',
  './data/5.png'
];
var video, videoTexture;

for (let i = 0; i < total; i++) {
  if (i == -1) { // video -> não usual
    // cria o elemento de vídeo
    video = document.createElement('video');
    video.src = 'a.mp4';
    video.loop = true;
    video.muted = true;       // ⚠ autoplay exige mutado
    video.autoplay = true;
    video.playsInline = true; // importante no mobile
    video.style.display = 'none';
    document.getElementById("spiral").appendChild(video); // precisa estar no DOM

    // só criar a textura quando o vídeo estiver pronto
    video.addEventListener('loadeddata', () => {
      videoTexture = new THREE.VideoTexture(video);
      videoTexture.minFilter = THREE.LinearFilter;
      videoTexture.magFilter = THREE.LinearFilter;
      videoTexture.format = THREE.RGBAFormat;

      const mat = new THREE.MeshStandardMaterial({
        map: videoTexture,
        side: THREE.DoubleSide, roughness: 0.4,
        metalness: 0.1,
        transparent: true,
        opacity: 1
      });

      const geo = new THREE.PlaneGeometry(8, 8);
      const card = new THREE.Mesh(geo, mat);
      scene.add(card);
      // cards.push(card);

      video.play(); // ⚡ começa a tocar


    });

    // continue;



    // // cria textura a partir do vídeo
    // const videoTexture = new THREE.VideoTexture(video);
    // videoTexture.minFilter = THREE.LinearFilter;
    // videoTexture.magFilter = THREE.LinearFilter;
    // videoTexture.format = THREE.RGBFormat;

    // // taka o texto
    // const size = 512;
    // const canvas = document.createElement('canvas');
    // const ctx = canvas.getContext('2d');
    // ctx.fillStyle = 'rgba(0,0,0,0.4)';
    // ctx.fillRect(0, 0, size, size);
    // ctx.fillStyle = '#00e5ff';
    // ctx.font = 'bold 48px Arial';
    // ctx.textAlign = 'center';
    // ctx.textBaseline = 'middle';
    // ctx.fillText(`Card ${i + 1}`, size / 2, size / 2);
    // videoTexture.needsUpdate = true;

    // // cria o card com o vídeo
    // const geometry = new THREE.PlaneGeometry(6, 4);
    // const material = new THREE.MeshStandardMaterial({
    //   map: videoTexture,
    //   side: THREE.DoubleSide
    // });

    // const videoCard = new THREE.Mesh(geometry, material);
    // scene.add(videoCard);
    // cards.push(videoCard);
    // videoCard.position.z = -5;
  } else {
    const geo = new THREE.PlaneGeometry(8, 8);

    // 👉 Aqui é onde chama a função
    const texture = makeCardTexture(textCard[i], images[i]);
    const mat = new THREE.MeshStandardMaterial({
      map: texture,
      side: THREE.DoubleSide,
      roughness: 0.4,
      metalness: 0.1,
      transparent: true,
      opacity: 1,
      name: `card${i + 1}`
    });
    const card = new THREE.Mesh(geo, mat);
    cards.push(card);
    scene.add(card);
  }
}



pri(cards);

var scroller = 0;
var t = 0;
var loop = 0;
var loopLastChange = 0;
var lastT = 0, t = 0;
var timeToChange = 100;

// --- Atualização com base no scroll ---
function updateCards(scrollPos) {
  // return;
  lastT = t;
  const altY = 1250, divScrollPos = 0.001, divScroller = 0.002;
  t = (altY + scrollPos) * divScrollPos + scroller * altY * divScroller; // controle de rotação
  if (t != lastT) {
    loopLastChange = loop;
  }
  const radius = 5;
  const spacing = 0;
  const difY = 15;
  const coe = 1 / 2;

  var appr = 0;
  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    const progress = t - i * Math.PI / 2 + 3; // controla quando cada card começa
    const visible = true;
    const angle = -i * Math.PI * coe + t;// gira conforme o scroll
    const y = progress * Math.PI - i * spacing; // sobe suavemente
    card.rotation.y = Math.PI;
    card.scale.x = -1;

    if (visible) {
      // card.material.opacity = Math.min(1, progress); // aparece gradualmente
      card.position.set(Math.cos(angle) * radius, y - difY, Math.sin(angle) * radius);
      card.lookAt(0, y - difY, 0);
      card.material.opacity = 1;
    }
    appr++;
  }
  pri(appr);
  console.log(scrollPos, t, loopLastChange, loop - loopLastChange >= timeToChange);
  loop++;
  if (loop % 60 == 0 && false) {
    if (loop - loopLastChange >= timeToChange) {
      var gaps = [3684];
      var adding = 2500;
      for (var i = 0; i <= total - 1; i++) {
        gaps[i + 1] = gaps[i] + adding;
      }
      const dif = 650;
      for (var gap of gaps) {
        if (Math.abs(gap - scrollPos) <= dif) {
          console.log(gap);
          scroller = (t - (altY + gap) * divScrollPos) / (altY * divScroller);
          console.log((altY + scrollPos) * divScrollPos + scroller * altY * divScroller);
          break;
        }
      }
    }
  }
}

// --- Mouse parallax ---
const mouse = { x: 0, y: 0 };
window.addEventListener('mousemove', (e) => {
  mouse.x = (e.clientX / innerWidth - 0.5) * 2;
  mouse.y = (e.clientY / innerHeight - 0.5) * 2;
});


function attP(tecla) {
  if (tecla == 'w') {
    scroller -= 1;
  } else if (tecla == 's') {
    scroller += 1;
  }

}
F
window.addEventListener('keydown', (event) => {
  const tecla = event.key; // pega a tecla pressionada
  if (/^[a-zA-Z]$/.test(tecla)) { // verifica se é letra
    attP(tecla);
  }
});

// --- Animação ---
function animate() {
  requestAnimationFrame(animate);
  const scroll = window.scrollY;
  if (videoTexture && video.readyState >= video.HAVE_CURRENT_DATA) {
    videoTexture.needsUpdate = true;
  }
  updateCards(scroll);

  // Parallax suave
  // camera.position.x += (mouse.x * 2 - camera.position.x) * 0.05;
  // camera.position.y += (-mouse.y * 2 - camera.position.y) * 0.05;
  // camera.lookAt(0, 0, 0);

  renderer.render(scene, camera);
}
animate();

// --- Resize ---
window.addEventListener('resize', () => {
  // camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

// image & text
// --- Função para gerar textura com imagem + texto ---
// --- Função para gerar textura com imagem + texto (corrigida) ---
function makeCardTexture(text, imageURL) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const size = 512;
  canvas.width = size;
  canvas.height = size;

  // Carrega a imagem com THREE.TextureLoader
  const loader = new THREE.TextureLoader();
  const texture = new THREE.CanvasTexture(canvas);

  loader.load(
    imageURL,
    (imageTex) => {
      const img = imageTex.image;
      ctx.drawImage(img, 0, 0, size, size);

      // Sobreposição escura pra legibilidade
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.fillRect(0, 0, size, size);

      // Texto centralizado 
      ctx.fillStyle = '#00e5ff';
      ctx.font = 'bold 36px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text[0], size / 2, size / 2 - 50);
      ctx.font = 'bold 24px Arial';
      ctx.fillText(text[1], size / 2, size / 2);
      ctx.fillText(text[2], size / 2, size / 2 + 30);

      texture.needsUpdate = true; // 🔹 força atualização no WebGL
    },
    undefined,
    (err) => console.error('Erro ao carregar imagem:', imageURL, err)
  );

  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}


function pri(item) {
  console.log(JSON.parse(JSON.stringify(item)))
}
