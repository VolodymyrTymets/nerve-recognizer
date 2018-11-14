const path = require('path');
const config = require('../../../config');
const { spawn } = require('child_process');

let recOut = null;
let nerveOut = null;

try {
  const Gpio = require('onoff').Gpio;
  recOut = new Gpio(config.gpio.rec, 'out');
  nerveOut = new Gpio(config.gpio.nerve, 'out');
} catch (err) {
  console.log('Error -> GPIO is not detected!!!');
}

class Notifier {
	constructor() {
		this._filePath = path.resolve(__dirname ,'../../assets', './notification.wav');
		this._gpio = {
			rec: recOut,
			nerve: nerveOut,
		};
		this._gpioNotify = this._gpioNotify.bind(this);
    this.soundNotify = this.soundNotify.bind(this);
	}

	_gpioNotify(name, value){
      this._gpio[name] && this._gpio[name].writeSync(value);
	}

	soundNotify() {
		console.log(`aplay -D plughw:2 ${this._filePath}`)
		spawn(`aplay -D plughw:2 ${this._filePath}`).catch(console.log);
	}

	nerveNotify() {
		this._gpioNotify('nerve', 1);
		setTimeout(() => this._gpioNotify('nerve', 0), 500);
		this.soundNotify();
	}
  recNotify(value) {
    this._gpioNotify('rec', value);
  }
}

const notify = new Notifier();

module.exports = { notify };