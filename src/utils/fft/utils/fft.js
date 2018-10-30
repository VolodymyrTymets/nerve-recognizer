const { max, indexOf, values } = require('lodash');
const fftLib = require('fourier-transform');

function nearestPow2( aSize ){
	return Math.pow( 2, Math.round( Math.log( aSize ) / Math.log( 2 ) ) );
}

const spliceSpectrum = (spectrum, length) => {
	const maxSpectrum = max(spectrum);
	const maxIndex = indexOf(spectrum, maxSpectrum);
	const from = maxIndex - (length / 2) || 0;
	const to = maxIndex + (length / 2);

	const splicedSpectrum = spectrum.slice(from >= 0 ? from : 0, to);
	return { splicedSpectrum,  maxIndex };
};


const fft = (wave) => {
	let waveLength = wave.length;
	let index = nearestPow2(waveLength);

	while (!(index <= wave.length)) {
		waveLength = waveLength - 2;
		index = nearestPow2(waveLength);
	}

	const cutedWave = wave.slice(0, index);
	const spectrum = fftLib(cutedWave);
	return { wave: values(cutedWave), spectrum };
};

module.exports = { fft, spliceSpectrum };
