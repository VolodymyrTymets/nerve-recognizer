const { fft, spliceSpectrum } = require('./utils/fft');
const { getSpectrumEnergy } = require('./utils/get-spectrum-energy');

const { getTissueType, getTissueTypeByNoiseLeavel } = require('./utils/tisue-type-getter');

const getSpectrumInfo = (wave, noiseLevel, config) => {
  // by fourier-transform
	const spectrum = fft(wave);
	const spliceSpectrumRes = spliceSpectrum(spectrum.spectrum, config.fft.N);
	const maxSpectrum = spectrum.spectrum[spliceSpectrumRes.maxIndex];
	const energy = getSpectrumEnergy(spectrum.spectrum, spliceSpectrumRes.maxIndex, 10) * 100;
	const rating = (maxSpectrum / noiseLevel) * 10000;

	const tissueType = getTissueType(energy, config.fft.minEnergy);
  const NtissueType = getTissueTypeByNoiseLeavel(rating, noiseLevel, config)
  console.log(`-------------N:[${NtissueType}] E:[${tissueType}]---------> l:[${noiseLevel}]  r:[${rating}] e:[${energy}] s:[${maxSpectrum}] `);
	return {
		energy,
		spectrum: spliceSpectrumRes.splicedSpectrum,
		maxIndex: spliceSpectrumRes.maxIndex,
        rating,
		tissueType: NtissueType
	}
};

module.exports = { getSpectrumInfo };
