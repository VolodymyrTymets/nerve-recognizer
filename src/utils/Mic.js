const _ = require('lodash');
const mic = require('mic');
const WavDecoder = require('wav-decoder');
const header = require('waveheader');

class Mic {
	constructor(setting) {
		this.log = this.log.bind(this);
		this._config = setting;
		this._startDate =  null;

	}

	_createInstance () {
		delete  this._micInputStream;
		delete  this._micInstance;
		if (this._config.DEBUG_MODE) {
			this.log(`mic: ${this._config.mic.device}`)
		}
		this._micInstance = mic(this._config.mic);
		this._micInputStream = this._micInstance.getAudioStream();
		this._micInputStream.on('error', this.log);

	}
	log(message) {
		console.log(`-> [Mic]: ${message.message || message}`);
		if (message.message) {
			console.log(message);
		}
	}


	start(startDate, onData) {
		try {
			this._startDate = startDate;
			this._createInstance();
			this._micInputStream.on('data', buffer => {
				WavDecoder.decode(Buffer.concat([header(this._config.mic.rate), buffer]))
					.then(audioData => onData(audioData))
					.catch(this._catch);
			});
			this._micInstance.start();
		} catch (error) {
			this.log(error);
		}
	}
	stop() {
    this._micInstance && this._micInstance.stop();
		this._startDate == null;
	}
}


module.exports = { Mic };