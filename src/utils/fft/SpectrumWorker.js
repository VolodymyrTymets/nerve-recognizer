const { mean, max } = require('lodash');
const { EventEmitter } = require('events');
const { fft } = require('./utils/fft');
const { colors } = require('../../utils/colors');
const { NERVE, MUSCLE } = require('../../constants');

class SpectrumWorker extends EventEmitter {
	constructor(config) {
    super();
	  this._statOfListen = null;
	  this._config = config.spectrumWorker;
	  this._DEBUG_MODE = config.DEBUG_MODE;

	  this._spectrums = [];
 	  this.MEAN_SPECTRUM = 0;
  }

	tI(n) { return parseInt(n, 10) }

	log(msg, color) {
    this._DEBUG_MODE &&
		console.log(color || colors.FgWhite, `[SpectrumWorker] --> ${msg}`);
	}
	start(wave) {
    const { minRateDiff, minTimeToNotify, timeToLearn } = this._config;
    this._statOfListen = this._statOfListen || new Date().getTime();
    const { spectrum } = fft(wave);

    const maxSpectrum = max(spectrum);
    const diffInSec = (new Date().getTime() - this._statOfListen ) / 1000;

    if(diffInSec > timeToLearn) {
      const ratingS = this.tI(100 - (this.MEAN_SPECTRUM * 100) / maxSpectrum) || 0;

      if(ratingS > minRateDiff) {
        this.log(`S:[${ratingS} %] ${maxSpectrum}/${this.MEAN_SPECTRUM}`, colors.FgRed);
        this.emit(NERVE, { ratingS, maxSpectrum });
			} else {
      	//clearTimeout(this._timeOut);
        this.emit(MUSCLE, { ratingS, maxSpectrum });
        this.log(`S:[${ratingS} %] ${maxSpectrum}/${this.MEAN_SPECTRUM}`, colors.FgGreen);
      }
      // clear
      this._spectrums = [];
    } else {
      this._spectrums.push(maxSpectrum);
      this.MEAN_SPECTRUM = mean(this._spectrums);
      this.log(`listening [${diffInSec}] ] S: ${maxSpectrum} /[${this.MEAN_SPECTRUM}]`, colors.FgWhite);
    }
	}
	stop() {
    this._spectrums = [];
    this.MEAN_SPECTRUM = 0
    this._statOfListen = null;
  }
}

module.exports = { SpectrumWorker };
