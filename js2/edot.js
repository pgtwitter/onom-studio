;
(function() {
	var onomStudioCanvas;
	var edotCamera, edotScene, edotRenderer;
	var edotCubs, edotMaterial, edotTexture;
	var edotStats;

	function edotInitTexture() {
		edotTexture = new THREE.Texture(onomStudioCanvas);
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
	}

	function edotAnimate() {
		requestAnimationFrame(edotAnimate);
		edotUpdateMotion();
		edotTexture.needsUpdate = true;
		edotRenderer.render(edotScene, edotCamera);
		edotStats.update();
		var w = window.innerWidth - 50;
		edotRenderer.setSize(w, w * (9 / 16));
	}

	function edotUpdateMotion() {
		var time = Date.now() * 0.001;
		var delta = Math.sin(time);
		edotCubs[0].rotation.y = Math.PI / 4 + 0.7 * delta;
		edotCubs[1].scale.x = 1 + 0.2 * delta;
		edotCubs[1].scale.y = 1 + 0.2 * delta;
		edotCubs[1].scale.z = 1 + 0.2 * delta;
		edotCubs[2].position.y = 2 + 0.7 * delta;
	}

	function edotInit() {
		onomStudioCanvas = document.getElementById('three');
		edotInitHTMLTags();
		edotInitRenderer();
		edotInitMesh();
		(document.getElementById('edotDiv')).appendChild(edotRenderer.domElement);
		edotStats = new Stats();
		(document.getElementById('edotDiv')).appendChild(edotStats.dom);
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
