const energy = process.env.ENERGY && parseFloat(process.env.ENERGY) || process.argv[2] && parseFloat(process.argv[2]) || 0.4
const micName = process.env.MIC && parseFloat(process.env.MIC) || process.argv[3] && parseFloat(process.argv[3]) === 0 ? 0 : 1;
const micDevice  = process.env.MICDEVICE && parseFloat(process.env.MICDEVICE) || process.argv[4] && parseFloat(process.argv[4]) === 0 ? 0 : 1;

module.exports = {
  fft: {
   // meanSpectrum: meanSpectrum.meanSpectrum,
    rating: 100,
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
    device: `${micName === 0 ? 'hw:' : 'plughw:'}${micDevice}`,
    fileType: 'wav',
  },
  gpio: {
    mic: 26,
    nerve: 21,
    muscle: 20,
  },
  limitOfSilence: 0.2,
  DEBUG_MODE: process.env.DEBUG || true,
};