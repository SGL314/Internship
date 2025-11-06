var things = [];
class Sphere {
    constructor(r, x, y) {
        this.raio = r;
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.xoff = 0;
        this.yoff = 0;
        this.color = "#ff0000";
    }
    log() {
        let desloc = 0.1;
        this.vx += (Math.random() - 0.5) * desloc;
        this.vy += (Math.random() - 0.5) * desloc;

        // console.log(noise(this.xoff, 0));
        // this.x = width / 2;
        // this.y = height / 2;

        this.x += this.vx;
        this.y += this.vy;

        if (this.x + this.raio >= width) {
            this.x = width - this.raio;
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
    }
    draw() {
        fill(255, 0, 0);
        circle(this.x, this.y, this.raio);
    }
    coll(ind) {
        let i = -1;
        for (var thing of things) {
            i++;
            if (i <= ind) continue;
            // difs
            let dx = thing.x - this.x;
            let dy = thing.y - this.y;
            // dist
            if (Math.pow(dx*dx+dy*dy,.5)>thing.raio+this.raio) continue;
            // angulo
            let ang = Math.atan2(dy, dx) * 180 / Math.PI; // ângulo em RADI﻿ANOS
            if (dy < 0) ang *= -1;
            else ang = 180 - ang + 180;
            //
            
        }
    }
}

var qtSpheres = 10;


function setup() {
    createCanvas(1000, 1000);
    noiseSeed(99);
    createSpheres();
}
function draw() {
    background(255);

    process();
}

function createSpheres() {
    let raio = 40;
    for (var i = 0; i < qtSpheres; i++) {
        things.push(new Sphere(
            raio,
            Math.random() * (width - 2 * raio) + raio,
            Math.random() * (height - 2 * raio) + raio
        ))
    }
}

function process() {
    let ind = 0;
    for (var thing of things) {
        thing.log();
        thing.draw();
        thing.coll(ind);
    }
}

