import * as THREE from 'https://unpkg.com/three@0.152.2/build/three.module.js';
// import  Noise  from 'https://cdn.jsdelivr.net/npm/noisejs@2.1.0/index.min.js';

const noise = new Noise(Math.random());

// animate();

const scene = new THREE.Scene();
const height = 881 * 2.4;
scene.background = new THREE.Color(0x070709);

const camera = new THREE.PerspectiveCamera(75, innerWidth / height, 0.1, 1000);
camera.position.z = 15;
camera.updateProjectionMatrix();

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(innerWidth, height);
document.body.insertBefore(renderer.domElement, document.querySelector('.ui'));

const light = new THREE.DirectionalLight(0xffffff, 1.2);
light.position.set(3, 5, 5);
scene.add(light);
scene.add(new THREE.AmbientLight(0x404040, 1));
var divScroller = 0;
const propThree2px = 80;
var propCard = 11;
var tamCard = propCard* 881 / height; //

const cards = [];
const textCard = [
    ["🏬 +20", "Empresa atendidas", "com soluções personalizadas"],
    ["🤝 15", "Serviços de alto", "impacto no mercado"],
    ["💵 +25 Milhões", "Em projetos executados", "com nossos parceiros"],
    ["🧾 +50", "Projetos estratégicos", "com o setor privado"],
    ["📜 +65", "Certificados emitidos", "com excelência técnica"]
];
const images = [
    './data/1.png',
    './data/2.png',
    './data/3.png',
    './data/4.png',
    './data/5.png'
];

function makeCardTexture(text, imageURL) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const size = 512;
    const sizeHeight = size;
    canvas.setAttribute('id', 'three');
    canvas.width = size;
    canvas.height = sizeHeight;

    const loader = new THREE.TextureLoader();
    const texture = new THREE.CanvasTexture(canvas);

    loader.load(imageURL, (imgTex) => {
        ctx.drawImage(imgTex.image, 0, 0, size, size);
        ctx.fillStyle = 'rgba(0,0,0,0.4)';
        ctx.fillRect(0, 0, size, size);

        ctx.fillStyle = '#00e5ff';
        ctx.font = 'bold 36px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text[0], size / 2, size / 2 - 50);
        ctx.font = 'bold 24px Arial';
        ctx.fillText(text[1], size / 2, size / 2);
        ctx.fillText(text[2], size / 2, size / 2 + 30);

        texture.needsUpdate = true;
    });

    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    return texture;
}

for (let i = 0; i < textCard.length; i++) {
    const geo = new THREE.PlaneGeometry(tamCard, tamCard);
    const mat = new THREE.MeshStandardMaterial({
        map: makeCardTexture(textCard[i], images[i]),
        side: THREE.DoubleSide,
        roughness: 0.4,
        metalness: 0.1,
        transparent: true,
        opacity: 1
    });
    const card = new THREE.Mesh(geo, mat);
    cards.push(card);
    scene.add(card);
}

let scroller = 0;
let t = 0;

function updateCards(scrollPos) {
    const radius = (propCard/8)*5 * 881 / height;
    const spacing = 8 * 881 / height;
    const difY = -0.5; // to down make up, to up make down
    const coe = 1 / 2;
    const padY = 0;

    const altY = 1400;
    const divScrollPos = 0.001;
    const divScroller = 0.002;

    t = (altY + scrollPos) * divScrollPos;

    // define um fator de rotação extra baseado no scroll
    const downPixels = 330;
    const scrollAngle = (scrollPos / downPixels + 0.35) * Math.PI / 2; // gira 90° a cada 200px descidos
    // console.log(scrollAngle);

    for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        const progress = t - i * Math.PI / (40 * height / 881);
        const y = progress * Math.PI - i * spacing;
        const angle = -i * Math.PI * coe + scrollAngle;

        card.rotation.y = Math.PI + scrollAngle;
        card.scale.x = -1;
        card.position.set(
            Math.cos(angle) * radius,
            y - difY + padY,
            Math.sin(angle) * radius
        );
        card.lookAt(0, y - difY + padY, 0);
    }
}


window.addEventListener('keydown', (e) => {
    if (e.key === 'w') scroller -= 1;
    if (e.key === 's') scroller += 1;
});

function animate() {
    requestAnimationFrame(animate);
    updateCards(window.scrollY);
    renderer.render(scene, camera);
}
animate();





window.addEventListener('resize', () => {
    camera.aspect = innerWidth / height;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, height);
});

document.addEventListener("DOMContentLoaded", () => {
    const boxes = document.querySelectorAll('.box');
    boxes.forEach((box, index) => {
        if (index % 2 === 0) box.classList.add('from-left');
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('show');
                else entry.target.classList.remove('show');
            });
        }, { threshold: 0.3 });
        observer.observe(box);
    });
});



function pri(item) {
  console.log(JSON.parse(JSON.stringify(item)))
}


// SPHERE


// mesh final
class Sphere {
    constructor(raio) {
        this.raio = raio;
        this.dy = 0;
        this.xoff=Math.random()*100;
        this.yoff=Math.random()*100;
        this.offs = 0.01*Math.random();
        this.esferaGeo = new THREE.SphereGeometry(raio, 32, 32);

        // material com cor e brilho
        this.esferaMat = new THREE.MeshStandardMaterial({
            color: 0xaa0000,
            roughness: 0.3,
            metalness: 0.25
        });
        this.img = new THREE.Mesh(this.esferaGeo, this.esferaMat);
    }
    dist(sphere){
        var dx = Math.pow(sphere.img.position.x-this.img.position.x,2);
        var dy = Math.pow(sphere.img.position.y-this.img.position.y,2);
        return Math.pow(dx+dy,.5);
    }
}

class CustomSinCurve extends THREE.Curve {
    constructor(){
        super();
        this.sx = 0;
        this.sy = 0;
        this.sz = 0;
    }
    setxyz(x,y,z){
        this.sx = x;
        this.sy = y;
        this.sz = z;
    }
	getPoint( t, optionalTarget = new THREE.Vector3() ) {
        console.log(t);
		const tx = (t+this.sx) * 3 - 1.5;
		const ty = Math.sin( 2 * Math.PI * (t+this.sy) );
		const tz = Math.cos(2 * Math.PI * (t+this.sz)) * 0.5;;
		return optionalTarget.set( tx, ty, tz );
	}
}
class Wave {
    constructor(angle){
        this.angle = angle;

        this.path = new CustomSinCurve( 10 );
        this.geo = new THREE.TubeGeometry(this.path, 100, 0.2, 32, true );
        this.mat = new THREE.MeshBasicMaterial( { roughness: 1.3,
            metalness: 0.25,color: 0x00ff00 } );

        this.img = new THREE.Mesh(this.geo, this.mat);
    }
    log(){
        this.img.position.x += 0.00001;
        this.img.position.y = 0;
        this.path.setxyz(this.path.sx+0.001,0,0)
    }
    distCenter(){
        var dx = Math.pow(sphere.img.position.x,2);
        var dy = Math.pow(sphere.img.position.y,2);
        return Math.pow(dx+dy,.5);
    }
}

var spheres = [];
var mx = 20,my = 50;
for (let i = 0; i < 1000; i++) {
    var sphere = new Sphere(0.25/2);
    sphere.img.position.set(
        (Math.random() - 0.5) * mx,
        (Math.random() - 0.5) * my,
        0
    );
    spheres.push(sphere);
}
for (var sphere of spheres) {
    // scene.add(sphere.img);
}

// --- Animação da esfera (movimento + rotação) ---
function moverEsfera() {
    return;
    // movimento senoidal no eixo Y
    // console.log(spheres[0].dy, window.scrollY);
    for (var sphere of spheres) {
        const desloc = 0.03;
        if (window.scrollY != sphere.dy / divScroller) {
            sphere.img.position.y -= sphere.dy - window.scrollY * divScroller;
            sphere.dy = window.scrollY * divScroller;
        }
        // noise.perlin2(t, 0)
        sphere.img.position.y += 0 + noise.perlin2(sphere.xoff,0)*desloc;
        sphere.img.position.x += 0 + noise.perlin2(0,sphere.yoff)*desloc;
        sphere.xoff += sphere.offs;
        sphere.yoff += sphere.offs;

        // sphere.img.rotation.x += 0.01;
        // sphere.img.rotation.y += 0.02;

        // if (Math.pow(Math.pow(sphere.img.position.x - mouse.x, 2) + Math.pow(sphere.img.position.y - mouse.y, 2), .5) < 1) { // dif mouse and sphere
        //     // sphere.esferaMat.color.set(0x0000aa);

        //     // pri("dentro");
        // } else {
        // }
        

        // colisão
        var normalColor = true;
        for (var sphere2 of spheres) {
            if (sphere2 != sphere){
                if (sphere.dist(sphere2)<sphere.raio*2){
                    pri("o");
                    sphere.esferaMat.color.set(0x0000aa);
                    sphere2.esferaMat.color.set(0x0000aa);
                    normalColor = false;
                }
            }
        }
        if (normalColor) sphere.esferaMat.color.set(0xaa0000);
    }

}

var loop = 0,freq = 1;
var waves = [];

function logicWaves(){
    // return;
    if (loop == freq){
        var wave = new Wave(Math.random()*360);
        wave.img.position.set(
            (Math.random() - 0.5) * mx,
            (Math.random() - 0.5) * my,
            0
        );
        waves.push(wave);
        scene.add(wave.img);
    }
    for (var wave of waves){
        wave.log();
    }
    loop++;
}


const mouse = { x: 0, y: 0 };
window.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / innerWidth) * 2+1;
    mouse.y = -(e.clientY / innerHeight) * 2+1;
});

// adiciona chamada dentro do loop principal de animação:
const antigoAnimate = animate;
animate = function () {
    requestAnimationFrame(animate);
    const scroll = window.scrollY;
    // if (videoTexture && video.readyState >= video.HAVE_CURRENT_DATA) {
    //     videoTexture.needsUpdate = true;
    // }
    updateCards(scroll);
    moverEsfera(); // 👈 atualiza a esfera aqui
    logicWaves();
    renderer.render(scene, camera);
};
//