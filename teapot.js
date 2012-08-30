// crafty jQuery one-liner
var $ = function(d) { return document.getElementById(d); };

// scene size
var WIDTH = 724, 
  HEIGHT = 512;

// camera settings: fov, aspect ratio, near, far
var FOV = 45,
  ASPECT = WIDTH / HEIGHT,
  NEAR = 0.1,
  FAR = 10000;

// get the DOM element to attach to
var container = $('container');

// create a WebGL renderer, set its size and append it to the DOM
var renderer = new THREE.WebGLRenderer();

renderer.setSize(WIDTH, HEIGHT);

renderer.setClearColorHex(0x111111, 1);
renderer.clear();

container.appendChild(renderer.domElement);

// create a camera and position camera on z axis (starts at 0,0,0)
var camera = new THREE.PerspectiveCamera( FOV, ASPECT, NEAR, FAR);
camera.position.z = 100;

// create a scene
var scene = new THREE.Scene();

// add the camera to the scene
scene.add(camera);

// add an object (teapot) to the scene
var loader = new THREE.JSONLoader(),

  createScene = function createScene( geometry ) {

	  var material = new THREE.MeshFaceMaterial();

	  teapot = new THREE.Mesh( geometry, material );
	
	  teapot.scale.set(8, 8, 8);
	
	  teapot.position.set( 0, -10, 0 );

	  scene.add( teapot );
	  
	console.log('matrix ' + teapot.matrix);
    console.log('rotation ' + teapot.rotation.x);
  };

loader.load('teapot-model.js', createScene );

// create a spot light, position it and add it to the scene
var light = new THREE.SpotLight();
light.position.set( 170, 330, -160 );
scene.add(light);

light = new THREE.AmbientLight(0x333333);
// light.position.set( 170, 330, -160 );
scene.add(light);

// enable shadows on the renderer
renderer.shadowMapEnabled = true;

// draw
renderer.render(scene, camera);
animate();

//animate
function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}

window.addEventListener('DOMContentLoaded', function init() {
  //connect to server using websockets
  var ws = new WebSocket('ws://0.0.0.0:8080/');
  ws.onopen = function() {
    console.log('connection');
	var alpha = $('alpha-value'),
		beta = $('beta-value'),
		gamma = $('gamma-value');
		
    ws.onmessage = function(e) {
      var data = JSON.parse(e.data),
		  avalue = data.alpha / 180 * Math.PI,
		  bvalue = data.beta / 180 * Math.PI,
		  gvalue = data.gamma / 180 * Math.PI;
		
        teapot.rotation.set(gvalue, avalue, -bvalue);
		alpha.innerHTML = Math.round(avalue * 10) / 10;
		beta.innerHTML = Math.round(bvalue * 10) / 10;
		gamma.innerHTML = Math.round(gvalue * 10) / 10;
		
        // console.log(data);
     };
   };
});