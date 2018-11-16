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

module.exports = { getTissueType };