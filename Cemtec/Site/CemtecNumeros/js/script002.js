import * as THREE from 'https://unpkg.com/three@0.152.2/build/three.module.js';
// import  Noise  from 'https://cdn.jsdelivr.net/npm/noisejs@2.1.0/index.min.js'; // carregou no html
// refatorar
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
    divScroller = 0.002;

    t = (altY + scrollPos) * divScrollPos;

    // define um fator de rotação extra baseado no scroll
    const downPixels = 310;
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
  console.log(JSON.parse(JSON.stringify(item)));
}

// SPHERE

// mesh final
var mx = 25,my = 25;

var spheres = [];
class Sphere {
    constructor(raio) {
        this.raio = raio;
		this.color = 0xff0000;
		this._colorColisonSphere = 0x0000ff;
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
	log(){
		// paredes
		if (this.img.position.x<-mx*0.5) this.img.position.x=-mx*0.5;
		else if (this.img.position.x>mx*0.5) this.img.position.x=mx*0.5;

		if (this.img.position.y<-my*0.5) this.img.position.y=-my*0.5;
		else if (this.img.position.y>my*0.5) this.img.position.y=my*0.5;

		// movimento
		const desloc = 0.03;
        if (window.scrollY != this.dy / divScroller) {
            this.img.position.y -= this.dy - window.scrollY * divScroller;
            this.dy = window.scrollY * divScroller;
        }
        this.img.position.y += 0 + noise.perlin2(this.xoff,0)*desloc;
        this.img.position.x += 0 + noise.perlin2(0,this.yoff)*desloc;
        this.xoff += this.offs;
        this.yoff += this.offs;

        // colisão
        var normalColor = true;
        for (var sphere of spheres) {
            if (sphere != this){
                if (this.dist(sphere)<this.raio*2){
                    // pri("o");
                    this.esferaMat.color.set(this.colorColisonSphere);
                    sphere.esferaMat.color.set(sphere._colorColisonSphere);
                    normalColor = false;
                }
            }
        }

        if (normalColor) this.esferaMat.color.set(this.color);



	}
    dist(sphere){
        var dx = Math.pow(sphere.img.position.x-this.img.position.x,2);
        var dy = Math.pow(sphere.img.position.y-this.img.position.y,2);
        return Math.pow(dx+dy,.5);
    }
}

class CustomSinCurve extends THREE.Curve {
    constructor(sla,lbs){
        super(sla);
        this.sx = 0;
        this.sy = 0;
        this.sz = 0;
		this.lambdas = lbs;
    }
    setxyz(x,y,z){
        this.sx += x;
        this.sy += y;
        this.sz += z;
    }
	getPoint( t, optionalTarget = new THREE.Vector3() ) {
        // console.log(t);
		const tx = (t+this.sx) * 2 *this.lambdas- 1.5;
		const ty = Math.sin( 2 * Math.PI * (t+this.sy) *this.lambdas );
		const tz = 0;
		return optionalTarget.set( tx, ty, tz );
	}
}
class Wave {
    constructor(color,angle){
        this.angle = angle;
		this.loopLogUp = 0;
		this.img;
		this.raioInterior = 0.05;
		this.color = color;
		this.logUp();
    }
    log(){
		var delta = -0.004,mult = 20;
        this.img.position.x += delta*mult*Math.cos(this.angle);
        this.img.position.y += delta*mult*Math.sin(this.angle);
        this.path.setxyz(0,delta*2,0);
		this.loopLogUp++;
		this.interactSpheres();
		this.logUp();
    }
	logUp(){
		scene.remove(this.img);

		var poss;
		if (this.loopLogUp > 0){
			poss = [this.img.position.x,this.img.position.y,this.img.position.z];
		}else{
			this.path = new CustomSinCurve( 10,5);
		}
		
        this.geo = new THREE.TubeGeometry(this.path, 100, this.raioInterior, 32, false );
        this.mat = new THREE.MeshStandardMaterial({
			roughness: 1.3,
            metalness: 0.25,color: this.color
		});
        this.img = new THREE.Mesh(this.geo, this.mat);   
		this.img.rotation.z = this.angle; 

		if (this.loopLogUp > 0) this.img.position.set(poss[0],poss[1],poss[2]); 
		scene.add(this.img);
	}
	interactSpheres(){
		// Cria um Raycaster
		const raycaster = new THREE.Raycaster();
		const direction = new THREE.Vector3();

		for (var sphere of spheres){
			// Ponto de partida do raio (centro da esfera)
			const origin = sphere.img.position.clone(); 
			
			// Direção do raio: do centro da esfera para o centro da Wave
			direction.subVectors(this.img.position, origin).normalize();

			// Configura o Raycaster
			raycaster.set(origin, direction);
			
			// Define a distância máxima do raio para que não detecte objetos distantes. 
			// Aqui, usamos 2x o raio da esfera como limite.
			raycaster.far = sphere.raio * 2 + this.raioInterior*2; 

			// Encontra as intersecções com a malha da Wave
			const intersects = raycaster.intersectObject(this.img, true);

			if (intersects.length > 0) {
				// Houve intersecção! A esfera e a onda estão se tocando.
				sphere.color = this.color;
			}
		}
	}
	distSphere(sphere){
		var dx = Math.pow(sphere.img.position.x-this.img.position.x,2);
		var dy = Math.pow(sphere.img.position.y-this.img.position.y,2);
		return Math.pow(dx+dy,.5);
	}
    distCenter(){
        var dx = Math.pow(this.img.position.x,2);
        var dy = Math.pow(this.img.position.y,2);
        return Math.pow(dx+dy,.5);
    }
}


for (let i = 0; i < 200; i++) {
    var sphere = new Sphere(0.25/2);
    sphere.img.position.set(
        (Math.random() - 0.5) * mx,
        (Math.random() - 0.5) * my,
        0
    );
    spheres.push(sphere);
}
for (var sphere of spheres) {
    scene.add(sphere.img);
}

var waves = [];

// --- Animação da esfera (movimento + rotação) ---
function moverEsfera() {
    // movimento senoidal no eixo Y
    for (var sphere of spheres) {
		sphere.log();
    }
}

var loop = 0,baseFreq = 400,freq = baseFreq,variFreq = 200; // 200

function logicWaves(){
    // return;
    if (loop % freq == 0){
        var wave = new Wave(rgbaToHex(Math.random()*255,Math.random()*255,Math.random()*255,Math.random(),true),Math.PI/180*360*Math.random());
        waves.push(wave);
		wave.img.position.set(

			Math.cos(wave.angle)*Math.min(mx,my),
			Math.sin(wave.angle)*Math.min(mx,my),
		0);
		var inF = Math.floor(Math.random()*variFreq)+baseFreq
		freq = inF + (inF<freq) ? freq+inF : 0;
    }
    for (var wave of waves){
		wave.log();
		if (wave.distCenter() > mx*2) waves.splice(waves.findIndex((x) => x == wave),1);
    }
	console.log(waves.length,freq,loop%freq);
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
    moverEsfera(); // esfera
    logicWaves();  // waves
    renderer.render(scene, camera);
};
//