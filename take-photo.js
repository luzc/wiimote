//QR code reader taken from: http://shinydemos.com/qr-code/

var camera = {
	video:'',
	canvas:'',
	ctx:'',
	dialog:'',
	timer:'',

	loop: function() {
		camera.captureToCanvas();
		camera.canvas.style.height = camera.video.clientHeight+'px'; 
		camera.timer = setTimeout(camera.loop,2500);
	},

	captureToCanvas: function() {
		camera.ctx.drawImage(camera.video, 0, 0, camera.video.videoWidth, camera.video.videoHeight, 0, 0, camera.canvas.width, camera.canvas.height);
	},

	canvasInit: function() {
		camera.canvas = document.getElementById('canvas');
		camera.canvas.width = camera.video.videoWidth;
		camera.canvas.height = camera.video.videoHeight;
		camera.ctx = camera.canvas.getContext('2d');
		camera.timer = setTimeout(camera.loop,2500);
	},

	init: function() {
		camera.video = document.getElementById('camera-stream');

		// Standard and prefixed methods for hooking into stream
		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
		window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;

		if (navigator.getUserMedia) {        
				navigator.getUserMedia({video: true}, function(stream) {
					// Replace the source of the video element with the stream from the camera
					camera.video.src = window.URL.createObjectURL(stream) || stream;
					setTimeout(camera.canvasInit,250); // Needed to get videoWidth/videoHeight
				}, errorCallback);
				
				function errorCallback(error) {
						camera.dialog.innerHTML = 'error';
						return;
					}	
			} else {
			camera.dialog.innerHTML = 'no <code>getUserMedia</code> support';
			return;
		}
	}
};

window.addEventListener('load',camera.init,true);