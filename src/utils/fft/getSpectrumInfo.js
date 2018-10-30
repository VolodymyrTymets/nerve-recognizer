const { fft, spliceSpectrum } = require('./utils/fft');
const { getSpectrumEnergy } = require('./utils/get-spectrum-energy');

const { getTissueType } = require('./utils/tisue-type-getter');

const getSpectrumInfo = (wave, config) => {
  // by fourier-transform
	const spectrum = fft(wave);
	const spliceSpectrumRes = spliceSpectrum(spectrum.spectrum, config.fft.N);
	const energy = getSpectrumEnergy(spectrum.spectrum, spliceSpectrumtRes.maxIndex, 10);
	const tissueType = getTissueType(energy, config.fft.minEnergy);

	return {
		energy,
		spectrum: spliceSpectrumRes.splicedSpectrum,
		maxIndex: spliceSpectrumRes.maxIndex,
		tissueType
	}
};

module.exports = { getSpectrumInfo };