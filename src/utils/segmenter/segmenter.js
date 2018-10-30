const _ = require('lodash');
const { EventEmitter } = require('events');


const N = 100;

/**
 * Provide filter wave
 * 
 * @example 
 *          const segmenter = new Segmenter();
            segmenter.on('segment', segment => {            
            });
            segmenter.findSegmant(wave)      
 **/
class Segmentor extends EventEmitter {
	constructor(settings) {
		super();
		this._waves = [];
		this._everages = [];
		this._limitOfSilence = 0;
		this._meanSegmentLength = settings.meanSegmentLength;
		this._minSegmentTimeToListen = settings.minSegmentTimeToListen;
		// take every minSegmentTimeToListen s limit of sielence
		setInterval(() => {
			this._limitOfSilence = _.mean(this._everages);
			this._everages = [];
		}, this._minSegmentTimeToListen);

	}
	/**
 *  filter noiz from wave, by equall sum of 100 ponts with standart (SUM_OF_100)
 *  @param {Array} 
 **/
	findSegment(wave) {
		const sums = [];
		for (let index = 0; index < wave.length; index = index + N) {
			const slice = wave.slice(index, index + N);
			const sum = _.sumBy(slice, Math.abs);
			sums.push(sum);
		}

		const average = _.mean(sums);
		this._everages.push(average);

		if (average < this._limitOfSilence * 0.7) {
			if (this._waves.length >= this._meanSegmentLength) {
				const segment = _.flatten(this._waves);
				this.emit('segment', segment, average);
			}

			this._waves = [];
			this.emit('noSegment');
		} else {
			this._waves.push(_.values(wave));

			// avoid save segment more then 3 sec
			if(this._waves.length > 33) {
				this._waves = [];
				this.emit('noSegment');
			}
		}
	}
}

module.exports = Segmentor;