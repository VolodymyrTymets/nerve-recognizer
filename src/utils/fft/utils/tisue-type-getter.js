
const getTissueType = (energy, minEnergy) => {
	let tissueType = '';
	if (energy > minEnergy * 0.8) {
		tissueType = 'nerve';
	}
	// if (energy < config.minEnergy) {
	//   tissueType = 'muscle';
	// }
	return tissueType;
};

module.exports = { getTissueType };