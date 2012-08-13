window.addEventListener('DOMContentLoaded', function init() {
  var pos, $id = function(d) { return document.getElementById(d); };
  
  //Create moon
  var moon = new PhiloGL.O3D.Sphere({
    nlat: 30,
    nlong: 30,
    radius: 2,
    textures: 'moon.gif'
  });

  //Create application
  PhiloGL('webgl-canvas', {
    camera: {
      position: {
        x: 0, y: 0, z: -7
      }
    },
    textures: {
      src: ['moon.gif'],
      parameters: [{
        name: 'TEXTURE_MAG_FILTER',
        value: 'LINEAR'
      }, {
        name: 'TEXTURE_MIN_FILTER',
        value: 'LINEAR_MIPMAP_NEAREST',
        generateMipmap: true
      }]
    },
    scene: {
      lights: {
        enable: true,
        ambient: {
          r: 0.2,
          g: 0.2,
          b: 0.2
        },
        directional: {
          color: {
            r: 0.8,
            g: 0.8,
            b: 0.8
          },
          direction: {
            x: -1,
            y: -1,
            z: -1
          }
        }
      }
    },
    onError: function() {
      alert("There was an error creating the app.");
    },
    onLoad: function(app) {
      //Unpack app properties
      var gl = app.gl,
          program = app.program,
          scene = app.scene,
          canvas = app.canvas,
          camera = app.camera;

      //Basic gl setup
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clearDepth(1.0);
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL);
      gl.viewport(0, 0, +canvas.width, +canvas.height);
      //Add object to the scene
      scene.add(moon);
      //Draw the scene
      function draw() {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        //render moon
        scene.render();
        //request new frame
        PhiloGL.Fx.requestAnimationFrame(draw);
      }

      draw();

      //connect to server using websockets
      var ws = new WebSocket('ws://0.0.0.0:8080/');
      ws.onopen = function() {
        ws.onmessage = function(e) {
          var data = JSON.parse(e.data);
          if( data.alpha && data.beta && data.gamma){
            moon.rotation.y = -data.alpha / 300;
            moon.rotation.x = data.beta / 300;
            moon.rotation.z = data.gamma / 300;
            moon.update();
          } else {
            var debug = new Image();  
            debug.src = data.base64img;
            debug.onload
            //moon.textures.src = data.base64img; 
          }
        };
      };
    }
  });
});
