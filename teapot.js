// crafty jQuery one-liner
var $ = function(d) { return document.getElementById(d); };

// scene size
var WIDTH = window.innerWidth/3, 
  HEIGHT = window.innerHeight/3;

// camera settings: fov, aspect ratio, near, far
var FOV = 45,
  ASPECT = WIDTH / HEIGHT,
  NEAR = 0.1,
  FAR = 10000;

// get the DOM element to attach to
var $container = $('container');

// create a WebGL renderer, set its size and append it to the DOM
var renderer = new THREE.WebGLRenderer();

renderer.setSize(WIDTH, HEIGHT);

renderer.setClearColorHex(0xCCC, 1);
renderer.clear();

//$container.append(renderer.domElement);
document.body.appendChild(renderer.domElement);

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
	
	  teapot.position.set( 0, 0, 0 );

	  scene.add( teapot );
  };

loader.load('teapot-model.js', createScene );

// create a spot light, position it and add it to the scene
var light = new THREE.SpotLight();
light.position.set( 170, 330, -160 );
scene.add(light);

// enable shadows on the renderer
renderer.shadowMapEnabled = true;

// enable shadows for a light
light.castShadow = true;

// enable shadows for the teapot
//teapot.castShadow = true;
//teapot.receiveShadow = true;

// add a floor that'll receive the shadow
var planeGeo = new THREE.PlaneGeometry(400, 200, 10, 10);
var planeMat = new THREE.MeshLambertMaterial({color: 0xFFFFFF});
var plane = new THREE.Mesh(planeGeo, planeMat);
plane.receiveShadow = true;
scene.add(plane);

// draw
renderer.render(scene, camera);
animate();

//animate
function animate() {
	requestAnimationFrame( animate );
	renderer.render(scene, camera);
}

window.addEventListener('DOMContentLoaded', function init() {
  //connect to server using websockets
  var ws = new WebSocket('ws://0.0.0.0:8080/');
  ws.onopen = function() {
    console.log('connection');
    ws.onmessage = function(e) {
      var data = JSON.parse(e.data);
       if( data.alpha){
         //moon.rotation.y = -data.alpha / 300;
         //moon.rotation.x = data.beta / 300;
         //moon.rotation.z = data.gamma / 300;
         //moon.update();
       } else {
         var src = data.img;
         var img = new Image();
         img.src = src;
         img.onload = function() {
           document.body.appendChild(img);
         };
         console.log(data);
       }
     };
   };
});