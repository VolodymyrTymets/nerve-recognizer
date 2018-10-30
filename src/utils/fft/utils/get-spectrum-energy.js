const { sum } = require('lodash');

const getIndexOfMax = spectrum => {
	let max = spectrum[0];
	let maxIndex = 0;

	for (var i = 1; i < spectrum.length; i++) {
		if (spectrum[i] > max) {
			maxIndex = i;
			max = spectrum[i];
		}
	}
	return maxIndex;
};

const getSpectrumEnergy= (spectrum, maxIndex, l) => {
	const indexOfMax = maxIndex || getIndexOfMax(spectrum);
	// build arra to calculate energy +-l from max amplitude
	const toCalculation = [];
	let leftIndex = indexOfMax;
	do {
		toCalculation.push(spectrum[leftIndex]);
		leftIndex--;
	} while (leftIndex && (leftIndex > indexOfMax - l));
	toCalculation.reverse();

	let rightIndex = indexOfMax + 1;
	do {
		toCalculation.push(spectrum[rightIndex]);
		rightIndex++;
	} while (rightIndex && (rightIndex < indexOfMax + l));


	// calculate squere
	const squeres = [];
	for(let index = 0; index < toCalculation.length - 1; index ++) {
		const a = index;
		const b = toCalculation[index + 1] - toCalculation[index];
		squeres.push(a * b);
	}

	return Math.abs(sum(squeres));
};

module.exports = { getSpectrumEnergy };