;
(function() {
	var edotMidiInput = {
		array: [],
		names: {},
		data: {},
	};
	var edotMidiCtrls = {};
	var edotMidiSetting = {
		gui: (new dat.GUI()),
		data: {
			'f0_cameraPosition': 0,
			'f4_width': 1,
			'f3_count': 16,
			'f0_cameraSpin': 65,
			'f0_cameraShake': 66,
		},
	};

	function edotMidiZeroToOne(x) {
		return (x / 127.0);
	}

	function edotMidiOneToOne(x) {
		return (x / 127.0) * 2.0 - 1.0;
	}

	function edotMidiNoteOn(channel, noteNumber, velocity) {
		console.log('On', channel, noteNumber, velocity);
		if (!edotMidiSettings) return;
		var ctrl = edotMidiCtrls[edotMidiSettings[noteNumber]];
		if (!ctrl) return;
		if (ctrl.__max)
			ctrl.setValue(((ctrl.__max - ctrl.__min) / 127.0) * velocity + ctrl.__min);
		else if (!ctrl.__color)
			ctrl.setValue(velocity > 64)
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
				case 0xb0:
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
			sysex: false
		}).then(function(midiAccess) {
			var inputIterator = midiAccess.inputs.values();
			for (var i = inputIterator.next(); !i.done; i = inputIterator.next()) {
				edotMidiInput.array.push(i.value);
				edotMidiInput.names[i.value.name] = edotMidiInput.array.length - 1;
			}
			if (edotMidiInput.array.length > 0) {
				edotMidiInput.data.device = 0;
				edotMidiSetting.gui.add(edotMidiInput.data, 'device', edotMidiInput.names)
					.onFinishChange(function(value) {
						edotMidiSwitchDevice(value);
					});
				edotMidiSwitchDevice(edotMidiInput.data.device);
			}
		}, function(error) {
			console.dir(error);
		});
	}

	function edotMidiUpdateSettings() {
		edotMidiSettings = {};
		Object.keys(edotMidiSetting.data).forEach(function(key) {
			var value = edotMidiSetting.data[key];
			edotMidiSettings[value] = key;
		});
	}

	function edotMidiCreateSettingGUI(f, t) {
		f.__controllers.forEach(function(ctrl) {
			edotMidiCtrls[ctrl.property] = ctrl;
			if (edotMidiSetting.data[ctrl.property] === void 0)
				edotMidiSetting.data[ctrl.property] = -1;
			t.add(edotMidiSetting.data, ctrl.property, -1, 127, 1)
				.onFinishChange(function(value) {
					edotMidiUpdateSettings();
				});
		});
		Object.keys(f.__folders).forEach(function(key) {
			var nf = t.addFolder(key);
			if (f.__folders[key].closed == false)
				nf.open();
			edotMidiCreateSettingGUI(f.__folders[key], nf);
		});
	}

	document.addEventListener('DOMContentLoaded', function() {
		edotMidiInitMidiDevices();
		edotMidiCreateSettingGUI(window.gui, edotMidiSetting.gui);
		edotMidiUpdateSettings();
	});
})();
