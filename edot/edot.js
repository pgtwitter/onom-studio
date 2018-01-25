;
(function() {
	function edot0() {
		var c0 = document.createElement('canvas');
		c0.setAttribute('id', 'myCanvas');
		c0.setAttribute('width', '512');
		c0.setAttribute('height', '512');
		(document.getElementsByTagName('body')[0]).appendChild(c0);
		var c1 = document.createElement('canvas');
		c1.setAttribute('id', 'myCanvas2');
		c1.setAttribute('width', '512');
		c1.setAttribute('height', '512');
		(document.getElementsByTagName('body')[0]).appendChild(c1);
		c1.style.display = 'none';
		c1.style.position = 'absolute';
	}
	edot0();

	window.edot = function() {
		var targetCanvas = document.getElementById('three');
		if (!targetCanvas) return null;
		targetCanvas.setAttribute('width', '512');
		targetCanvas.setAttribute('height', '512');
		targetCanvas.style.width = 512;
		targetCanvas.style.height = 512;
		targetCanvas.style.display = 'none';
		targetCanvas.style.position = 'absolute';
		return (new THREE.Texture(targetCanvas));
	}
})();
