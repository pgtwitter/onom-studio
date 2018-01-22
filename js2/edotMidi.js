;
(function() {
	var edotMidiInput = {
		array: [],
	};
	var edotMidiGui = {
		selector: null,
	};

	function edotMidiZeroToOne(x) {
		return (x / 127.0);
	}

	function edotMidiOneToOne(x) {
		return (x / 127.0) * 2.0 - 1.0;
	}

	function edotMidiNoteOn(channel, noteNumber, velocity) {
		console.log('On', channel, noteNumber, velocity);
		switch (noteNumber) {
			case 0:
				controllers['f0_cameraPosition'].setValue(100 * edotMidiOneToOne(velocity));
				break;
			case 1:
				var v = velocity == 0 ? 0.1 : 20.0 * edotMidiZeroToOne(velocity);
				controllers['f4_width'].setValue(v);
				break;
			default:
				break;
		}
	}

	function edotMidiNoteOff(channel, noteNumber, velocity) {
		console.log('Off', channel, noteNumber, velocity);
	}

	function edotMidiSwitchDevice(index) {
		edotMidiInput.array.forEach(function(element) {
			element.onmidimessage = null;
		});
		if (index === '')
			return;
		edotMidiInput.array[index].onmidimessage = function(event) {
			if (event.data.length < 3)
				return;
			var channel = event.data[0] & 0x0f;
			var noteNumber = event.data[1];
			var velocity = event.data[2];
			switch (event.data[0] & 0xf0) {
				case 0x90:
					edotMidiNoteOn(channel, noteNumber, velocity);
					break;
				case 0x80:
					edotMidiNoteOff(channel, noteNumber, velocity);
					break;
				default:
					break;
			}
		};
	}

	function edotMidiInitMidiDevices() {
		if (!navigator.requestMIDIAccess)
			return alert('This browser does not seem to support Web MIDI.');
		navigator.requestMIDIAccess({
			sysex: true
		}).then(function(midiAccess) {
			var inputIterator = midiAccess.inputs.values();
			for (var i = inputIterator.next(); !i.done; i = inputIterator.next()) {
				edotMidiInput.array.push(i.value);
			}
			edotMidiInput.array.forEach(function(element, index) {
				var option = document.createElement('option');
				option.appendChild(document.createTextNode(element.name));
				option.setAttribute('value', index);
				edotMidiGui.selector.appendChild(option);
			});
			edotMidiGui.selector.addEventListener('change', function() {
				edotMidiSwitchDevice(this.value);
			}, false);
			if (edotMidiInput.array.length > 0) {
				edotMidiGui.selector.selectedIndex = 0;
				edotMidiGui.selector.dispatchEvent(new Event('change'));
			}
		}, function(error) {
			console.dir(error);
		});
	}

	function edotMidiInitHTMLTags() {
		var body = document.getElementsByTagName('body')[0];
		var div = document.createElement('div');
		div.setAttribute('id', 'edotMidiDiv');
		div.style.position = 'absolute';
		var select = document.createElement('select');
		select.setAttribute('id', 'inputDevice');
		div.appendChild(select);
		body.insertBefore(div, body.childNodes[0]);
		edotMidiGui.selector = document.getElementById('inputDevice');
	}

	document.addEventListener('DOMContentLoaded', function() {
		edotMidiInitHTMLTags();
		edotMidiInitMidiDevices();
	});
})();
