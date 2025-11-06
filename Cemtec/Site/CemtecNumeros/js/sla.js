var a = 10;
var cs = [1,2,3,4]
// big for
for (var i=0;i<cs.length;i++){
	var c = cs[i];
	console.log(c);
	a = sum(a,c);
	console.log(a);
}

function sum(a,b){
	return a + b;
}