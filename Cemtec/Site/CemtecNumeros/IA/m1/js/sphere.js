
// class CustomSinCurve extends THREE.Curve {
//     constructor(radius){
//         super();
//         // this.radius = radius;
//         this.sx = 0;
//         this.sy = 0;
//         this.sz = 0;
//     }
//     setxyz(x,y,z){
//         this.sx = x;
//         this.sy = y;
//         this.sz = z;
//     }
//     getPoint( t, optionalTarget = new THREE.Vector3() ) {
//         console.log(t);
//         const tx = (t+this.sx) * 16 - 1.5;
//         const ty = Math.sin( 8 * Math.PI * (t+this.sy) );
//         const tz = t;
//         return optionalTarget.set( tx, ty, tz );
//     }
// }
// class Wave {
//     constructor(angle){
//         this.angle = angle;

//         this.path = new CustomSinCurve( 10 );
//         this.geo = new THREE.TubeGeometry(this.path, 100, 0.05, 32, true );
//         this.mat = new THREE.MeshBasicMaterial( { roughness: 1,
//             metalness: 0.25,color: 0x00ff00 } );

//         this.img = new THREE.Mesh(this.geo, this.mat);
//     }
//     log(){
//         this.img.position.x = -3;
//         this.img.position.y = 0;
//         this.path.setxyz(this.path.sx+0.0000,0,0)
//     }
//     distCenter(){
//         var dx = Math.pow(sphere.img.position.x,2);
//         var dy = Math.pow(sphere.img.position.y,2);
//         return Math.pow(dx+dy,.5);
//     }
// }