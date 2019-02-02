const micName = process.argv[2] && parseFloat(process.argv[2]) === 0 ? 0 : 1;
const micDevice  = process.argv[3] && parseFloat(process.argv[3]) === 0 ? 0 : 1;
const rating = process.argv[4] && parseFloat(process.argv[4])
const minNoiseLevel = process.argv[5] && parseFloat(process.argv[5])
module.exports = {
  fft: {
   // meanSpectrum: meanSpectrum.meanSpectrum,
    rating: rating || 40,
    minNoiseLevel: minNoiseLevel || 0.5,
    minEnergy: 0.5,
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
    mic: 13,
    nerve: 26,
    muscle: 19,
  },
 // limitOfSilence: 0.2,
  DEBUG_MODE: process.env.DEBUG || true,
};
