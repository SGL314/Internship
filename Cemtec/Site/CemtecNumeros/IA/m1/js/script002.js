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
    constructor(sla, lbs) {
        super(sla);
        this.sx = 0;
        this.sy = 0;
        this.sz = 0;
        this.lambdas = lbs;
    }
    setxyz(x, y, z) {
        this.sx += x;
        this.sy += y;
        this.sz += z;
    }
    getPoint(t, optionalTarget = new THREE.Vector3()) {
        const tx = (t + this.sx) * 2 * this.lambdas - 1.5;
        const ty = Math.sin(2 * Math.PI * (t + this.sy) * this.lambdas);
        const tz = 0;
        return optionalTarget.set(tx, ty, tz);
    }
}
class Wave {
    constructor(color, angle) {
        this.angle = angle;
        this.loopLogUp = 0;
        this.img;
        this.raioInterior = 0.05;
        this.color = color;
        this.delta = -0.001; // Velocidade de translação
        this.mult = 20;

        // Propriedade para armazenar os vértices originais para deformação
        this.originalVertices = null; 
        
        this.logUp();
    }

    // Função que cria a geometria UMA VEZ e a atualiza nos frames seguintes.
    logUp() {
        // SETUP: Cria a Geometria, o Material e o Mesh apenas na primeira vez
        if (this.loopLogUp === 0) {
            const tubularSegments = 100; // Número de segmentos ao longo do tubo (para deformação e colisão)
            const radialSegments = 16;   // Número de segmentos ao redor do tubo

            this.path = new CustomSinCurve(10, 5);
            this.mat = new THREE.MeshStandardMaterial({
                roughness: 1.3,
                metalness: 0.25,
                color: this.color
            });

            this.geo = new THREE.TubeGeometry(this.path, tubularSegments, this.raioInterior, radialSegments, false);
            this.img = new THREE.Mesh(this.geo, this.mat);
            
            // Armazena a posição original dos vértices
            this.originalVertices = Array.from(this.geo.attributes.position.array);

            this.img.rotation.z = this.angle;
            scene.add(this.img);
        }
        
        // Em chamadas subsequentes (loopLogUp > 0), não faz nada aqui.
        // A lógica de movimento e deformação foi movida para this.log()
    }

    // Função que modifica os vértices para criar o efeito "cobrinha"
    deformGeometry(time) {
        const positionAttribute = this.geo.attributes.position;
        const vertexCount = positionAttribute.count;
        
        const noiseScale = 5.0; // Espaçamento das ondulações
        const noiseSpeed = 0.5; // Velocidade da animação

        for (let i = 0; i < vertexCount; i++) {
            const index = i * 3;
            
            // Recupera a posição original (X, Y, Z)
            const x_orig = this.originalVertices[index];
            const y_orig = this.originalVertices[index + 1];
            const z_orig = this.originalVertices[index + 2];
            
            // Usa a coordenada Y original como offset de ruído ao longo do tubo
            const distanceAlongCurve = y_orig; 

            // Gera o ruído baseado na posição original ao longo da curva e no tempo (loop)
            const noiseValue = noise.perlin2(
                distanceAlongCurve * noiseScale, 
                time * noiseSpeed 
            );

            // Fator de deformação
            const deformationFactor = 0.05 * this.raioInterior * 8; 
            
            // Deforma Z (contorção para fora do plano XY)
            positionAttribute.setZ(i, z_orig + noiseValue * deformationFactor);
            
            // Para criar um efeito de pulsação/volume, você pode deformar X também (opcional)
            // positionAttribute.setX(i, x_orig + noiseValue * deformationFactor);
        }

        // Sinaliza ao Three.js que os vértices precisam ser recalculados
        positionAttribute.needsUpdate = true;
    }

    // Lógica principal de movimento, colisão e deformação
    log() {
        // 1. Move o ponto inicial da curva (para simular crescimento)
        this.path.setxyz(0, this.delta * 2, 0); 

        // 2. Deforma a Geometria (Efeito Cobrinha)
        // A variável 'loop' deve ser a contagem de frames do seu animate()
        this.deformGeometry(loop * 0.01); 

        // 3. Move o Mesh no espaço (Translação)
        this.img.position.x += this.delta * this.mult * Math.cos(this.angle);
        this.img.position.y += this.delta * this.mult * Math.sin(this.angle);
        
        this.loopLogUp++;
        this.interactSpheres();
        this.logUp(); 
    }

    // Lógica de colisão aprimorada (checa pontos da curva)
    interactSpheres() {
        // Otimização: A curva deve ser recomputada, mas vamos limitar os pontos
        // a 50 em vez de 100 para melhor desempenho.
        const curvePoints = this.path.getPoints(50); 
        const collisionThreshold = this.raioInterior; // Não precisa somar o raio da esfera

        for (var sphere of spheres) {
            let isColliding = false;
            
            // Itera sobre pontos da curva (máximo 50)
            for (const curvePoint of curvePoints) {
                
                // Transforma o ponto local da curva para a posição real na cena
                const pointWorldPosition = curvePoint.clone();
                pointWorldPosition.applyMatrix4(this.img.matrixWorld);

                // Calcula a distância 3D entre o ponto da curva e o centro da esfera
                const distance = pointWorldPosition.distanceTo(sphere.img.position);

                // Colisão se a distância for menor que o raio da esfera + o raio do tubo
                if (distance < sphere.raio + collisionThreshold) {
                    isColliding = true;
                    break;
                }
            }

            if (isColliding) {
                sphere.color = this.color;
            }
        }
    }

    // Métodos de Distância
    distCenter() {
        var dx = Math.pow(this.img.position.x, 2);
        var dy = Math.pow(this.img.position.y, 2);
        return Math.pow(dx + dy, .5);
    }
}

var teste = new Wave(0x000000,0);
var qtSpheres = 100;

for (let i = 0; i < qtSpheres; i++) {
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

var loop = 0,baseFreq = -0.004/teste.delta*400,freq = baseFreq,variFreq = 200; // 200
var tetoLoop_antiTravamento = 0; // <= 0 to never blocks

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
		freq = inF + (inF<freq) ? freq-inF+1 : 0;
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
    if (loop < tetoLoop_antiTravamento || tetoLoop_antiTravamento <= 0){
    }
    moverEsfera(); // esfera
    logicWaves();  // waves
    renderer.render(scene, camera);
};
//