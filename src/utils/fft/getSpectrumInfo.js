const { fft, spliceSpectrum } = require('./utils/fft');
const { getSpectrumEnergy } = require('./utils/get-spectrum-energy');

const { getTissueType } = require('./utils/tisue-type-getter');

const getSpectrumInfo = (wave, noiseLevel, config) => {
  // by fourier-transform
	const spectrum = fft(wave);
	const spliceSpectrumRes = spliceSpectrum(spectrum.spectrum, config.fft.N);
	const energy = getSpectrumEnergy(spectrum.spectrum, spliceSpectrumRes.maxIndex, 10);
	const rating = (spectrum.spectrum[spliceSpectrumRes.maxIndex] / noiseLevel) * 10000;
	const tissueType = getTissueType(rating, config.fft.rating);

	return {
		energy,
		spectrum: spliceSpectrumRes.splicedSpectrum,
		maxIndex: spliceSpectrumRes.maxIndex,
        rating,
		tissueType
	}
};

module.exports = { getSpectrumInfo };
