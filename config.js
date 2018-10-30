module.exports = {
  fft: {
   // meanSpectrum: meanSpectrum.meanSpectrum,
    meanEnergy: process.env.ENERGY && parseFloat(process.env.ENERGY) || 0.4,
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
    device: `plughw:${process.env.MIC || 1}`,
    fileType: 'wav',
  },
  gpio: {
    rec: 21,
    nerve: 21,
  },
  limitOfSilence: 0.01,
  DEBUG_MODE: process.env.DEBUG || true,
};