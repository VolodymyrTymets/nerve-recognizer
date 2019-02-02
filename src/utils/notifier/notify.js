const path = require('path');
const config = require('../../../config');
const { exec } = require('child_process');
const { NERVE, MIC, MUSCLE } = require('../../constants');

let micOut = null;
let nerveOut = null;
let muscleOut = null;

try {
  const Gpio = require('onoff').Gpio;
  micOut = new Gpio(config.gpio.mic, 'out');
  nerveOut = new Gpio(config.gpio.nerve, 'out');
  muscleOut = new Gpio(config.gpio.muscle, 'out');
} catch (err) {
  console.log('Error -> GPIO is not detected!!!');
}

class Notifier {
	constructor() {
    this._filePath = {
    	def: path.resolve(__dirname ,'../../assets', './notification.wav'),
      nerve: path.resolve(__dirname ,'../../assets', './nerve.wav'),
      muscle: path.resolve(__dirname ,'../../assets', './muscle.wav'),
    };

		this._gpio = {
			mic: micOut,
			nerve: nerveOut,
			muscle: muscleOut,
		};
		this._gpioNotify = this._gpioNotify.bind(this);
    this.soundNotify = this.soundNotify.bind(this);
	}

	_gpioNotify(name, value){
      this._gpio[name] && this._gpio[name].writeSync(value);
	}

	soundNotify(type = 'def') {
		const filePath = this._filePath[type];
		exec(`aplay -D plughw:2 ${filePath}`);
    exec(`aplay -D plughw:1 ${filePath}`);
    exec(`aplay -D plughw:0 ${filePath}`);
    exec(`aplay -D hw:0 ${filePath}`);
	}

	nerveNotify() {
		this._gpioNotify(NERVE, 1);
    this._gpioNotify(MUSCLE, 0);
		// setTimeout(() => this._gpioNotify(NERVE, 0), 500);
		// this.soundNotify('nerve');
	}
  muscleNotify() {
    this._gpioNotify(MUSCLE, 1);
    this._gpioNotify(NERVE, 0);
    // setTimeout(() => this._gpioNotify(MUSCLE, 0), 500);
    // this.soundNotify(MUSCLE);
  }
  gpioOff() {
    this._gpioNotify(MUSCLE, 0);
    this._gpioNotify(NERVE, 0);
    this._gpioNotify(MIC, 0);
  }
  micNotify(value) {
    this._gpioNotify(MIC, value);
  }
  clear() {
    this._gpio.mic && this._gpio.mic.unexport();
    this._gpio.nerve && this._gpio.nerve.unexport();
    this._gpio.muscle && this._gpio.muscle.unexport();
  }
}

const notify = new Notifier();

module.exports = { notify };
