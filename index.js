 

var websocketServerUrl = 'ws://0.0.0.0:8080/';
var imageServerUrl = 'http://0.0.0.0:8081/';

var $ = function(d) { return document.getElementById(d); };

window.addEventListener('DOMContentLoaded', function init() {
  //init websocket connections
  //device orientation sync socket
  var ws = new WebSocket(websocketServerUrl);
  ws.onopen = function() {
    ws.opened = true;
  };
  
  //listen to device orientation
  window.addEventListener('deviceorientation', function(e) {
    if (ws.opened) {
      ws.send(JSON.stringify({
        alpha: e.alpha,
        beta: e.beta,
        gamma: e.gamma
      }));
    }
  });
  
  //sync canvas
  var shutter = $('shutter');
  shutter.addEventListener('click', sendTexture, false);
  
  //send texture to model 
  function sendTexture() {
    // getting the canvas, and creating an image from it
    var canvas = $('canvas');
    var url = canvas.toDataURL('image/jpeg');
    console.log(url);
    url = url.replace(/^data:image\/\w+;base64,/, "");
    console.log(url);
    
    var xhr = new XMLHttpRequest();
    xhr.open('POST', imageServerUrl, true);
    xhr.setRequestHeader('Content-Type', 'text/plain');
    xhr.addEventListener('readystatechange', function(e) {
      if(xhr.readyState == xhr.DONE) {
        if (xhr.status == 200) {
          console.log('completed successfully', xhr.responseText);
        }
      }
    });
    xhr.send('base64img=' + encodeURIComponent(url));
  }
  
});
