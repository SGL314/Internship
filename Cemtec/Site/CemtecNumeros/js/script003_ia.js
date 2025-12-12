import * as THREE from 'https://unpkg.com/three@0.152.2/build/three.module.js';
// import  Noise  from 'https://cdn.jsdelivr.net/npm/noisejs@2.1.0/index.min.js'; // carregou no html
// refatorar
const noise = new Noise(Math.random());

// animate();

const scene = new THREE.Scene();
const height = 881 * 2.3;
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
var propCard = 13;
var tamCard = propCard * 881 / height; //

const cards = [];
const textCard = [
    ["🏬 +20", "Empresa atendidas com", "soluções personalizadas"],
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
        ctx.font = 'bold 40px Arial';
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

    // 1. Material para a FRENTE (Com textura e texto)
    const backMat = new THREE.MeshStandardMaterial({
        map: makeCardTexture(textCard[i], images[i]),
        side: THREE.BackSide, // Renderiza APENAS a face frontal
        roughness: 0.4,
        metalness: 0.1,
        transparent: false,
        opacity: 1
    });
    const backCard = new THREE.Mesh(geo, backMat);

    // 2. Material para as COSTAS (Exemplo: uma cor sólida escura)
    const frontMat = new THREE.MeshStandardMaterial({
        color: 0xffffff, // Cor escura para o verso
        side: THREE.FrontSide, // Renderiza APENAS a face traseira
        roughness: 0.4,
        metalness: 0.1,
        transparent: false,
        opacity: 1
    });
    const frontCard = new THREE.Mesh(geo, frontMat);

    // 3. Cria um grupo para segurar os dois lados
    const cardGroup = new THREE.Group();
    cardGroup.add(backCard);
    cardGroup.add(frontCard);

    // Agora, o array 'cards' armazena o grupo que contém os dois lados
    cards.push(cardGroup);
    scene.add(cardGroup);
}
let scroller = 0;
let t = 0;

function updateCards(scrollPos) {
    const radius = (propCard / 8) * 5 * 881 / height;
    const spacing = 8 * 881 / height;
    const difY = -0.5; // to down make up, to up make down
    const coe = 1 / 2;
    const padY = 0;

    const altY = 1400;
    const divScrollPos = 0.001;
    divScroller = 0.002;

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
    console.log(JSON.parse(JSON.stringify(item)));
}

// SPHERE
// mesh final
var mx = 20, my = 23;

var spheres = [];
class Sphere {
    constructor(raio) {
        this.raio = raio;
        this.color = 0xff0000;
        this.colorColisonSphere = 0x0000ff;
        this.dy = 0;

        this.xoff = Math.random() * 100;
        this.yoff = Math.random() * 100;
        this.offs = 0.01 * Math.random();
        this.esferaGeo = new THREE.SphereGeometry(raio, 32, 32);
		this.isColliding = false;

        // material com cor e brilho
        this.esferaMat = new THREE.MeshStandardMaterial({
            color: 0xaa0000,
            roughness: 0.3,
            metalness: 0.25
        });
        this.img = new THREE.Mesh(this.esferaGeo, this.esferaMat);
    }
    log(ind) {
        // paredes
        if (this.img.position.x < -mx * 0.5) this.img.position.x = -mx * 0.5;
        else if (this.img.position.x > mx * 0.5) this.img.position.x = mx * 0.5;

        if (this.img.position.y < -my * 0.5) this.img.position.y = -my * 0.5;
        else if (this.img.position.y > my * 0.5) this.img.position.y = my * 0.5;

        // movimento
        const desloc = 0.03;
        if (window.scrollY != this.dy / divScroller) {
            this.img.position.y -= this.dy - window.scrollY * divScroller;
            this.dy = window.scrollY * divScroller;
        }
        this.img.position.y += 0 + noise.perlin2(this.xoff, 0) * desloc;
        this.img.position.x += 0 + noise.perlin2(0, this.yoff) * desloc;
        this.xoff += this.offs;
        this.yoff += this.offs;

        // colisão
		let i = -1;
        for (var sphere of spheres) {
			i++;
			if (i<=ind) continue;
            if (sphere != this) {
                if (this.dist(sphere) < this.raio+sphere.raio) {
					sphere.colorColisionSphere = this.colorColisonSphere; // neeeeecesário 
                    this.esferaMat.color.set(this.colorColisonSphere);
                    sphere.esferaMat.color.set(sphere.colorColisonSphere);
					this.isColliding = true;// neeeeecesário
					sphere.isColliding = true;// neeeeecesário
                }
            }
        }
		if (!this.isColliding) this.esferaMat.color.set(this.color);
		this.isColliding = false;
    }
    dist(sphere) {
        var dx = Math.pow(sphere.img.position.x - this.img.position.x, 2);
        var dy = Math.pow(sphere.img.position.y - this.img.position.y, 2);
        return Math.pow(dx + dy, .5);
    }
}

class CustomSinCurve extends THREE.Curve {
    constructor(sla, lbs) {
        super(sla);
        this.sx = 0; 
        this.lambdas = lbs; 
    }
    setxyz(x, y, z) {
        this.sx += x;
    }
    getPoint(t, optionalTarget = new THREE.Vector3()) {
        const angle = t * 2 * Math.PI * this.lambdas;
        
        // Comprimento Fixo (Escala de -10 a 10)
        const fixedLength = 20; 
        const tx = t * fixedLength - (fixedLength / 2) + this.sx; 

        // Raio e Rotação da Hélice (Eixos Y e Z local)
        const radius = 1.0; 
        const ty = Math.cos(angle) * radius;
        const tz = Math.sin(angle) * radius;
        
        return optionalTarget.set(tx, ty, tz);
    }
}
class Wave {
    constructor(len,color, angle, x, y, z) {
        this.angle = angle;
        this.loopLogUp = 0;
        this.img;
        this.group; // Variável para o THREE.Group
        this.raioInterior = 0.05;
        this.color = color;
        this.delta = -0.004;
        this.mult = 20;
        this.currentScale = 0.01; // Inicia a escala em 0 (tamanho zero)

        // 🌟 NOVO: Criar o THREE.Group
        this.group = new THREE.Group();

        // 1. Criação ÚNICA da Geometria e Material
		this.lambda = len;
        this.path = new CustomSinCurve(5, this.lambda); 
        this.mat = new THREE.MeshStandardMaterial({
            roughness: 1.3,
            metalness: 0.25,
            color: this.color
        });
        this.geo = new THREE.TubeGeometry(this.path, 100, this.raioInterior, 32, false);
        this.img = new THREE.Mesh(this.geo, this.mat); // O mesh é o filho

        // 2. Aplicar Transformações ao Grupo e ao Mesh
        
        // O GRUPO faz a posição e a rotação direcional (aponta a onda)
        this.group.position.set(x, y, z);
        this.group.rotation.z = this.angle; 
        this.group.scale.set(this.currentScale, this.currentScale, this.currentScale);
        
        // Adiciona o mesh ao grupo
        this.group.add(this.img);
        
        // Adiciona o GRUPO à cena
        scene.add(this.group); 
    }
    
    log() {
        // Translação: faz a onda se afastar do centro (aplicado no GROUP)
        this.group.position.x += this.delta * this.mult * Math.cos(this.angle);
        this.group.position.y += this.delta * this.mult * Math.sin(this.angle);
        
        // Anima o crest da onda (deslocamento)
        this.path.setxyz(this.delta * 2, 0, 0);
        // if (this.currentScale < maxScale) {
        //     this.currentScale = Math.min(maxScale, this.currentScale + growthRate);
        // }
		this.group.scale.set(1,1,1);
		
        // 🌀 Rotação da Voltinha: Aplicada no MESH interno, no eixo X local
        // Eixo X é o eixo longitudinal da curva, garantido pela hierarquia do Grupo.
        const rotationSpeed = this.delta*this.mult*Math.PI*this.lambda/10; 
        this.img.rotation.x += rotationSpeed; 

        this.loopLogUp++;
        this.interactSpheres();
    }

    interactSpheres() {
        // Nota: A matriz de transformação this.img.matrixWorld já inclui a escala e rotação do Grupo
        const curvePoints = this.path.getPoints(100);

        for (var sphere of spheres) {
            let isColliding = false;

            for (const curvePoint of curvePoints) {
                // A posição do ponto é transformada usando a matriz MUNDIAL do mesh
                const pointWorldPosition = curvePoint.clone();
                pointWorldPosition.applyMatrix4(this.img.matrixWorld);

                const distance = pointWorldPosition.distanceTo(sphere.img.position);

                // O raio da onda é afetado pela escala do grupo
                const collisionThreshold = sphere.raio + this.raioInterior * this.currentScale; 

                if (distance < collisionThreshold) {
                    isColliding = true;
                    break; 
                }
            }

            if (isColliding) {
                sphere.color = this.color;
            }
        }
    }
    distSphere(sphere) {
        // Usa a posição do GRUPO
        var dx = Math.pow(sphere.img.position.x - this.group.position.x, 2);
        var dy = Math.pow(sphere.img.position.y - this.group.position.y, 2);
        return Math.pow(dx + dy, .5);
    }
    distCenter() {
        // Usa a posição do GRUPO
        var dx = Math.pow(this.group.position.x, 2);
        var dy = Math.pow(this.group.position.y, 2);
        return Math.pow(dx + dy, .5);
    }

	removeMe(){
		scene.remove(this.group);
		this.geo.dispose();
	}
}

var teste = new Wave(0x000000, 0);
var qtSpheres = 70;

for (let i = 0; i < qtSpheres; i++) {
    var sphere = new Sphere(0.25 / 2);
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
// Assumindo que 'loop' é uma variável global que incrementa a cada frame
// Assumindo que 'rgbaToHex' é uma função auxiliar global (se não estiver definida, isso falhará)

var loop = 0, baseFreq = -0.004 / teste.delta * 400, freq = baseFreq, variFreq = 200; // 200
var tetoLoop_antiTravamento = 0; // <= 0 to never blocks

function moverEsfera() {
    // Define o passo (step) para cada transição de cor (ex: 100 frames)
    const step = 50;
    let r = 0, g = 0, b = 0;

    // Calcula a posição atual no ciclo de 6 passos (6 * step frames)
    const cyclePos = loop % (step * 6);

    // Calcula o valor de variação linear dentro do passo atual (0 a 255 ou 255 a 0)
    const value = (cyclePos % step) * (255 / step);

    // --- Círculo Cromático em 6 Fases (RGB -> RGY -> GYB -> YBC -> BCM -> CMR) ---

    // FASE 1: R sobe, G=0, B=0 (Vermelho -> Amarelo)
    if (cyclePos >= 0 * step && cyclePos < 1 * step) {
        r = 255;
        g = value;
        b = 0;
    }
    // FASE 2: R desce, G=255, B=0 (Amarelo -> Verde)
    else if (cyclePos >= 1 * step && cyclePos < 2 * step) {
        r = 255 - value;
        g = 255;
        b = 0;
    }
    // FASE 3: R=0, G=255, B sobe (Verde -> Ciano)
    else if (cyclePos >= 2 * step && cyclePos < 3 * step) {
        r = 0;
        g = 255;
        b = value;
    }
    // FASE 4: R=0, G desce, B=255 (Ciano -> Azul)
    else if (cyclePos >= 3 * step && cyclePos < 4 * step) {
        r = 0;
        g = 255 - value;
        b = 255;
    }
    // FASE 5: R sobe, G=0, B=255 (Azul -> Magenta)
    else if (cyclePos >= 4 * step && cyclePos < 5 * step) {
        r = value;
        g = 0;
        b = 255;
    }
    // FASE 6: R=255, G=0, B desce (Magenta -> Vermelho)
    else if (cyclePos >= 5 * step && cyclePos < 6 * step) {
        r = 255;
        g = 0;
        b = 255 - value;
    }

    // Garante que os valores estejam entre 0 e 255 e sejam inteiros
    r = Math.floor(Math.max(0, Math.min(255, r)));
    g = Math.floor(Math.max(0, Math.min(255, g)));
    b = Math.floor(Math.max(0, Math.min(255, b)));

    // Converte a cor RGB final para Hex (assumindo que rgbaToHex está definida)
    const colorCollision = rgbaToHex(r, g, b, 1);

    // Aplica a cor de colisão a todas as esferas
	let ind = 0;
    for (var sphere of spheres) {
        // Isso define a cor que a esfera terá QUANDO colidir com outra esfera.
        sphere.colorColisonSphere = colorCollision;
        sphere.log(ind);
		ind ++;
    }//
	console.log(scene.children.length);
}

function logicWaves() {
    // return;
    if (loop % freq == 0 && waves.length < 3) {
        let angle =  Math.PI / 180 * 360 * Math.random();
		var lengthWave = 10;
        var wave = new Wave(lengthWave,
            rgbaToHex(Math.random()*255,Math.random()*255,Math.random()*255, 1, false),
            angle,
            Math.cos(angle) * (Math.min(mx, my)+lengthWave),
            Math.sin(angle) * (Math.min(mx, my)+lengthWave),
            0);
        waves.push(wave);
        
        var inF = Math.floor(Math.random() * variFreq) + baseFreq
        freq = inF + (inF < freq) ? freq - inF + 1 : 0;
    }
    for (var wave of waves) {
        wave.log();
        if (wave.distCenter() > mx * 2){
			let ind = waves.findIndex((x) => x == wave);
			waves[ind].removeMe();
			let a = [],b=[];
			for (let i = 0;i<ind;i++){
				a.push(waves[i]);
			}
			for (let i = ind+1;i<waves.length;i++){
				b.push(waves[i]);
			}
			waves = a.concat(b);
			scene.remove(wave.img);
		}
    }
    // console.log(waves.length);

}

const mouse = { x: 0, y: 0 };
window.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / innerWidth) * 2 + 1;
    mouse.y = -(e.clientY / innerHeight) * 2 + 1;
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
    if (loop < tetoLoop_antiTravamento || tetoLoop_antiTravamento <= 0) {
    }
    moverEsfera(); // esfera
    logicWaves();  // waves
    renderer.render(scene, camera);
    loop++;
};
//