;
(function() {
	var onomStudioCanvas;
	var edotCamera, edotScene, edotRenderer;
	var edotCubs, edotMaterial, edotImg, edotData, edotTexture;

	function edotInitTexture() {
		var edotCanvas = document.getElementById('edotCanvas');
		var w = edotCanvas.offsetWidth;
		var h = edotCanvas.offsetHeight;
		var ctx = edotCanvas.getContext('2d');
		edotData = new Uint8Array(ctx.getImageData(0, 0, w, h).data.buffer)
		edotTexture = new THREE.DataTexture(edotData, w, h, THREE.RGBAFormat);
		edotMaterial.map = edotTexture;
	}

	function edotInitMesh() {
		var geometry = new THREE.CubeGeometry(3, 3, 3);
		edotMaterial = new THREE.MeshBasicMaterial({
			transparent: true,
		});
		edotInitTexture();

		var cube0 = new THREE.Mesh(geometry, edotMaterial);
		edotScene.add(cube0);
		var cube1 = new THREE.Mesh(geometry, edotMaterial);
		edotScene.add(cube1);
		var cube2 = new THREE.Mesh(geometry, edotMaterial);
		edotScene.add(cube2);

		cube0.position.x = -2.44;
		cube0.position.y = -2;
		cube0.rotation.y = 45;

		cube1.position.x = 2.44;
		cube1.position.y = -2;
		cube1.rotation.y = 45;

		cube2.position.y = 2;
		cube2.rotation.y = 45;

		edotCubs = [];
		edotCubs.push(cube0);
		edotCubs.push(cube1);
		edotCubs.push(cube2);
	}

	function edotInitRenderer() {
		edotCamera = new THREE.PerspectiveCamera(
			50,
			16 / 9,
			1, 2000);
		edotCamera.position.z = 10;
		edotScene = new THREE.Scene();
		edotScene.add(edotCamera);
		edotRenderer = new THREE.WebGLRenderer({
			antialias: true,
		});
		edotRenderer.setClearColor(0xeeffff, 1);
	}

	function edotInitHTMLTags() {
		var body = document.getElementsByTagName('body')[0];

		var div = document.createElement('div');
		div.setAttribute('id', 'edotDiv');
		body.insertBefore(div, body.childNodes[0]);

		var canvas = document.createElement('canvas');
		canvas.setAttribute('id', 'edotCanvas');
		canvas.setAttribute('width', 1024);
		canvas.setAttribute('height', 1024);
		body.appendChild(canvas);
		canvas.style.visibility = 'hidden';
	}

	function edotAnimate() {
		requestAnimationFrame(edotAnimate);
		if (!edotImg || edotImg.complete) {
			edotImg = new Image();
			edotImg.src = onomStudioCanvas.toDataURL();
			setTimeout(edotUpdate, 0);
		}
		var w = window.innerWidth - 50;
		edotRenderer.setSize(w, w * (9 / 16));
	}

	function edotUpdateMotion() {
		var time = Date.now() * 0.001;
		var delta = Math.sin(time);
		edotCubs[0].rotation.y = 0.3 * delta;
		edotCubs[1].scale.x += 0.003 * delta;
		edotCubs[1].scale.y += 0.003 * delta;
		edotCubs[1].scale.z += 0.003 * delta;
		edotCubs[2].position.y += 0.03 * delta;
	}

	function edotUpdateTexture() {
		var edotCanvas = document.getElementById('edotCanvas');
		edotCanvas.style.display = 'block';
		var w = edotCanvas.offsetWidth;
		var h = edotCanvas.offsetHeight;
		var ctx = edotCanvas.getContext('2d');
		ctx.drawImage(edotImg,
			0, 0, edotImg.width, edotImg.height,
			0, 0, w, h);
		edotData.set(ctx.getImageData(0, 0, w, h).data);
		edotCanvas.style.display = 'none';
		edotTexture.needsUpdate = true;
	}

	function edotUpdate() {
		if (edotImg.complete == false) {
			setTimeout(edotUpdate, 0);
			return;
		}
		edotUpdateMotion();
		edotUpdateTexture();
		edotRenderer.render(edotScene, edotCamera);
	}

	function edotInit() {
		onomStudioCanvas = document.getElementById('three');
		edotInitHTMLTags();
		edotInitRenderer();
		edotInitMesh();
		(document.getElementById('edotDiv')).appendChild(edotRenderer.domElement);
	}

	window.edot = function() {
		edotInit();
		edotAnimate();
	}

	window.edotWait = function() {
		if (document.getElementById('three'))
			edot();
		else
			setTimeout(edotWait, 100);
	}
})();

setTimeout(edotWait, 100);
