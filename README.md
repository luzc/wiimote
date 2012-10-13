# HTML5 wiimote

## How to use this demo

1. Clone the repo `git clone https://github.com/luzc/wiimote.git`
2. You'll need [node.js](http://nodejs.org/) with the websocket-server@1.4.04 module to run the server. Make sure you have that.
3. Run the server with `node server.js`.
4. Once you have the server running, replace the IPs in `remote.js` and `model.js` with the IP of your server.
5. Access `remote.html` from a device orientation capable device, and `model.html` from a different device. 
6. Use the device running html as a wiimote to manipulate the teapot in your other device.
