var things = [], rems = [];
var paddingX = 100;
class Thing {
	constructor(color, raio, x, y) {
		this.id = id();
		this.color = color;
		this.raio = raio;
		this.x = x;
		this.y = y;
	}
	draw() {
		noStroke();
		fill(this.color);
		circle(this.x, this.y, this.raio * 2);
	}
}

class Sphere extends Thing {
	constructor(r, x, y) {
		var cor = [random(255), random(255), random(255)]
		var inCor = color(cor[0], cor[1], cor[2]);
		//
		super(inCor, r, x, y);
		this.dna = this.formDna(r, cor);
		this.codificateDna(this.dna, 0);
		this.vx = 0;
		this.vy = 0;
		this.countNew = 0;
		this.ceillingNew = 1;
		//
		this.desloc = 0.1 * this.raio / 20;
		//
		this.chargeNutri = 10;
		this.nutrients = 0;
		this.propRaio = this.raio/this.chargeNutri;
	}
	log() {
		this.countNew++;
		this.x += this.vx+(random()-.5)*2*this.desloc;
		this.y += this.vy+(random()-.5)*2*this.desloc;
		this.vx *= 0;
		this.vy *= 0;
		this.raio = (this.chargeNutri+this.nutrients) * this.propRaio;		

		if (this.x + this.raio >= width-paddingX) {
			this.x = width - this.raio-paddingX;
			this.vx *= -1;
		}
		if (this.x - this.raio <= 0) {
			this.x = this.raio;
			this.vx *= -1;
		}
		if (this.y + this.raio >= height) {
			this.y = height - this.raio;
			this.vy *= -1;
		}
		if (this.y - this.raio <= 0) {
			this.y = this.raio;
			this.vy *= -1;
		}
		//
		if (this.countNew >= this.ceillingNew) this.newSphere();
		//

	}
	draw() {
		noStroke();
		fill(this.color);
		circle(this.x, this.y, this.raio * 2);

		fill("#000000");
		stroke(1);
		var texto = this.nutrients+" "+(this.countNew < this.ceillingNew || this.chargeNutri > this.nutrients);
		text(texto, this.x-textWidth(texto), this.y);
		// stroke(1);
		// fill("#ff0000");
		// line(this.x, this.y, this.x + this.vx*25, this.y + this.vy*25);
	}
	coll(ind) {
		let i = -1;
		for (var thing of things) {
			if (this == thing) continue;
			// difs
			let dx = thing.x - this.x;
			let dy = thing.y - this.y;
			// dist
			if (Math.pow(dx * dx + dy * dy, .5) > thing.raio + this.raio) continue;
			if (thing instanceof Sphere) {
				// angulo
				let ang = Math.atan2(dy, dx) * 180 / Math.PI; // ângulo em RADI﻿ANOS
				if (dy < 0) ang *= -1;
				else ang = 180 - ang + 180;
				// empurr
				let reverseAng = (ang + 180) % 360;
				let force = this.raio;
				thing.x += Math.cos(reverseAng * Math.PI / 180) * force;
				thing.y += Math.sin(reverseAng * Math.PI / 180) * force;
				// fill("#000000");
				// text(reverseAng,thing.x,thing.y);
				// console.log(reverseAng)
				// line(thing.x, thing.y, thing.x+Math.cos(reverseAng * Math.PI / 180) * force*100,thing.y+Math.sin(reverseAng * Math.PI / 180) * force*100);
				//colisão
				if (this.dna["color"] != thing.dna["color"]) {
					if (thing.potency > this.potency) {
						thing.nutrients += this.nutrients + this.chargeNutri;
						rems.push(this.id);
					} else {
						this.nutrients += thing.nutrients + thing.chargeNutri;
						rems.push(thing.id);
					}
				}
			} else if (thing instanceof Nutrient) {
				this.nutrients += thing.chargeNutri;
				thing.chargeNutri = 0;
				rems.push(thing.id);
			}
		}
	}
	formDna(r, cor) {
		return {
			"raio": r,
			"color": cor,
			"potency": 0
		}
	}
	codificateDna(dna, vari) {
		let blue = (vari) ? dna["color"][2] * (1 + random()-0.5) : dna["color"][2];
		this.raio = dna["raio"];
		this.color = color(dna["color"][0], dna["color"][1], blue);
		this.potency = blue;
		this.dna["color"] = [dna["color"][0], dna["color"][1], blue];
		console.log(this.dna["color"]);
		this.dna["potency"] = blue;
	}
	newSphere() {
		//
		if (this.countNew < this.ceillingNew || this.chargeNutri > this.nutrients) return;
		let newSphere = new Sphere(this.dna["raio"], this.x+(random()*2-1), this.y+(random()*2-1));
		this.countNew = 0;
		this.nutrients -= newSphere.chargeNutri;
		//
		newSphere.dna = this.dna;
		newSphere.codificateDna(newSphere.dna, random() > 0.0);
		things.push(newSphere);
		//
		newSphere.vx = this.vx;
		newSphere.vy = this.vy;
		newSphere.x = this.x;
		newSphere.y = this.y;
		//		
		newSphere.countNew = 0;
		this.ceillingNew = this.ceillingNew * 2;
		newSphere.ceillingNew = this.ceillingNew * 2;
		this.countNew = 0;
	}
}

class Nutrient extends Thing {
	constructor(type, charge, raio, x, y) {
		var cor;
		switch (type) {
			case "A":
				cor = color(255, 0, 0);
				break;
			default:
				console.log("ERRO ao definir cor do nutrient");
		}
		//
		super(cor, raio, x, y);
		//
		this.type = type;
		this.chargeNutri = charge;
	}
	draw() {
		noStroke();
		fill(this.color);
		switch (this.type) {
			case "A":
				circle(this.x, this.y, this.raio*2);
				break;
		}
	}
	coll() { }	
	log() { }

}

var qtSpheres = 1;
var raio = 2 * 10;
var run = true, next = false, nextIsPressed = false;

function setup() {
	createCanvas(1000+paddingX, 1000);
	noiseSeed(99);
	createSpheres();
}
function draw() {
	background(255);

	process(run, next);
	logs();
}

function createSpheres() {
	for (var i = 0; i < qtSpheres; i++) {
		things.push(new Sphere(
			raio,
			Math.random() * (width - 2 * raio) + raio,
			Math.random() * (height - 2 * raio) + raio
		))
	}
}

function process(r, nx) {
	var ind = 0;
	if (nextIsPressed) nx = true;
	for (var thing of things) {
		thing.draw();
		if (r || nx) {
			thing.log();
			thing.coll(ind);
			next = false;
		}
		ind += 1;
	}
	// rems
	things = things.filter(t => !rems.includes(t.id));
	rems = [];
}
function logs(){
	//
	fill("#353535ff");
	textSize(15);
	rect(width-paddingX,0,paddingX, height);

	// charge
	fill("#ff0000");
	textSize(25);
	var texto = "C: "+charge;
	var pad = 5;
	text(texto,width-paddingX+pad,50);
	// qt
	fill("#ff0000");
	textSize(25);
	texto = "qt: "+things.length;
	text(texto,width-paddingX+pad,75);
}
//

function keyPressed() {
	if (key == " ") {
		run = (run) ? false : true
	}
	if (key == "n") {
		next = true;
		nextIsPressed = true;
	}
}
function keyReleased() {
	if (key == "n") {
		next = true;
		nextIsPressed = false;
	}
}

var charge = 1;
function mousePressed() {
	if (mouseButton == LEFT) {
		things.push(new Nutrient("A", charge, Math.sqrt(charge), mouseX, mouseY));
	}
}
function mouseWheel(event){
	if (event.deltaY <= 0) charge += 1;
	else charge -= 1;
}
