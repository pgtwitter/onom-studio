;
(function() {
	var Input = {
		array: [],
		names: {},
		data: {},
	};
	var Ctrls = {
		Onom: {},
		MIDI: {},
	};
	var Setting = {
		gui: (new dat.GUI()),
		data: {
			'f0_cameraPosition': 0,
			'f4_width': 1,
			'f4_color': 2,
			'f3_count': 16,
			'f0_cameraSpin': 65,
			'f0_cameraShake': 66,
		},
	};

	function noteOn(channel, noteNumber, velocity) {
		console.log('On', channel, noteNumber, velocity);
		if (!Settings) return;
		var ctrl = Ctrls.Onom[Settings[noteNumber]];
		if (!ctrl) return;
		if (ctrl.__max !== void 0)
			ctrl.setValue(((ctrl.__max - ctrl.__min) / 127.0) * velocity + ctrl.__min);
		else if (ctrl.__prev !== void 0)
			ctrl.setValue(velocity > 64)
		else if (ctrl.__color !== void 0) {
			if (ctrl.__color.s == 0.0)
				ctrl.__color.v = velocity / 127.0;
			else
				ctrl.__color.h = parseInt(velocity / 127.0 * 360.0);
			ctrl.setValue(ctrl.__color.toOriginal());
		}
	}

	function noteOff(channel, noteNumber, velocity) {
		console.log('Off', channel, noteNumber, velocity);
	}

	function switchDevice(index) {
		Input.array.forEach(function(element) {
			element.onmidimessage = null;
		});
		if (index === '')
			return;
		Input.array[index].onmidimessage = function(event) {
			if (event.data.length < 3)
				return;
			var channel = event.data[0] & 0x0f;
			var noteNumber = event.data[1];
			var velocity = event.data[2];
			switch (event.data[0] & 0xf0) {
				case 0xb0:
				case 0x90:
					noteOn(channel, noteNumber, velocity);
					break;
				case 0x80:
					noteOff(channel, noteNumber, velocity);
					break;
				default:
					break;
			}
		};
	}

	function initMidiDevices() {
		if (!navigator.requestMIDIAccess)
			return alert('This browser does not seem to support Web MIDI.');
		navigator.requestMIDIAccess({
			sysex: false
		}).then(function(midiAccess) {
			var inputIterator = midiAccess.inputs.values();
			for (var i = inputIterator.next(); !i.done; i = inputIterator.next()) {
				Input.array.push(i.value);
				Input.names[i.value.name] = Input.array.length - 1;
			}
			if (Input.array.length > 0) {
				Input.data.device = 0;
				Setting.gui.add(Input.data, 'device', Input.names)
					.onFinishChange(function(value) {
						switchDevice(value);
					});
				switchDevice(Input.data.device);
			}
		}, function(error) {
			console.dir(error);
		});
	}

	function updateSettings(currKey) {
		Settings = {};
		var currValue = Setting.data[currKey];
		Settings[currValue] = currKey;
		Object.keys(Setting.data).forEach(function(key) {
			var value = Setting.data[key];
			if (value > -1 && value != currValue) {
				Settings[value] = key;
			}
		});
		Object.keys(Setting.data).forEach(function(key) {
			var value = Setting.data[key];
			if (Settings[value] !== void 0 &&
				Settings[value] != key) {
				Setting.data[key] = -1;
				Ctrls.MIDI[key].updateDisplay();
			}
		});
	}

	function createSettingGUI(f, t) {
		f.__controllers.forEach(function(ctrl) {
			Ctrls.Onom[ctrl.property] = ctrl;
			if (Setting.data[ctrl.property] === void 0)
				Setting.data[ctrl.property] = -1;
			var ctrl2 = t.add(Setting.data, ctrl.property, -1, 127, 1)
				.onFinishChange(function(value) {
					updateSettings(this.property);
				});
			Ctrls.MIDI[ctrl.property] = ctrl2;
		});
		Object.keys(f.__folders).forEach(function(key) {
			var nf = t.addFolder(key);
			if (f.__folders[key].closed == false)
				nf.open();
			createSettingGUI(f.__folders[key], nf);
		});
	}

	document.addEventListener('DOMContentLoaded', function() {
		initMidiDevices();
		createSettingGUI(window.gui, Setting.gui);
		updateSettings();
	});
})();
