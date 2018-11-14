const energy = process.env.ENERGY && parseFloat(process.env.ENERGY) || process.argv[2] && parseFloat(process.argv[2]) || 0.4
const mic = process.env.MIC && parseFloat(process.env.MIC) || process.argv[3] && parseFloat(process.argv[3]) || 1;

module.exports = {
  fft: {
   // meanSpectrum: meanSpectrum.meanSpectrum,
    minEnergy: energy,
    N: 40, // points to compare
  },
  segmenter: {
    minSegmentLength: 5, // 500 ms,
    minSegmentTimeToListen: 2000, // 2000 ms
  },
  mic: {
    rate: 44100,
    channels: 2,
    debug: false,
    exitOnSilence: 6,
    device: `plughw:${mic}`,
    fileType: 'wav',
  },
  gpio: {
    rec: 26,
    nerve: 21,
  },
  limitOfSilence: 0.01,
  DEBUG_MODE: process.env.DEBUG || true,
};