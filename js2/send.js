;
(function() {
	var edotMidiOutput = {
		array: [],
		channel: '0',
	};
	var edotMidiGui = {
		ctrl: {},
		selector: null,
	};

	function edotMidiInitMidiDevices() {
		if (!navigator.requestMIDIAccess)
			return alert('This browser does not seem to support Web MIDI.');
		navigator.requestMIDIAccess({
			sysex: true
		}).then(function(midiAccess) {
			var outputIterator = midiAccess.outputs.values();
			for (var i = outputIterator.next(); !i.done; i = outputIterator.next()) {
				edotMidiOutput.array.push(i.value);
			}
			edotMidiOutput.array.forEach(function(element, index) {
				var option = document.createElement('option');
				option.appendChild(document.createTextNode(element.name));
				option.setAttribute('value', index);
				edotMidiGui.selector.appendChild(option);
			});
			if (edotMidiOutput.array.length > 0) {
				edotMidiGui.selector.selectedIndex = 0;
				edotMidiGui.selector.dispatchEvent(new Event('change'));
			}
		}, function(err) {
			console.dir(err);
		});
	}

	function edotMidiAddGUI(gui) {
		Object.keys(edotMidiSettings).forEach(function(noteNumber) {
			edotMidiGui.ctrl[edotMidiSettings[noteNumber]] = 0.0;
			gui.add(edotMidiGui.ctrl, edotMidiSettings[noteNumber], 0, 127, 1)
				.onChange(function(value) {
					edotMidiOutput.array[edotMidiGui.selector.value]
						.send(['0xB' + edotMidiOutput.channel, noteNumber, parseInt(value)]);
				});
		});

	}

	function edotMidiInitHTMLTags() {
		var body = document.getElementsByTagName('body')[0];
		var div = document.createElement('div');
		div.setAttribute('id', 'edotMidiDiv');
		div.style.position = 'absolute';
		var select = document.createElement('select');
		select.setAttribute('id', 'outputDevice');
		div.appendChild(select);
		body.insertBefore(div, body.childNodes[0]);
		edotMidiGui.selector = document.getElementById('outputDevice');
	}

	function edotMidiInitUI() {
		edotMidiInitHTMLTags();
		edotMidiAddGUI(new dat.GUI())
	}

	document.addEventListener('DOMContentLoaded', function() {
		edotMidiInitUI();
		edotMidiInitMidiDevices();
	});
}());
