const { NERVE, MUSCLE } = require('../../../constants');

const getTissueType = (energy, minEnergy) => {
	let tissueType = MUSCLE;
	if (energy > minEnergy) {
		tissueType = NERVE;
	}
	// if (energy < config.minEnergy) {
	//   tissueType = 'muscle';
	// }
	return tissueType;
};
const getTissueTypeByNoiseLeavel = (rating, noiseLevel, config) => {
  let tissueType = '';
  if (noiseLevel > config.fft.minNoiseLevel && rating > config.fft.rating) {
    tissueType = NERVE;
  }
  if (noiseLevel > config.fft.minNoiseLevel && rating < config.fft.rating) {
    tissueType = MUSCLE;
  }
  return tissueType;
};

module.exports = { getTissueType, getTissueTypeByNoiseLeavel };
