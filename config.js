const micName = process.argv[2] && parseFloat(process.argv[2]) === 0 ? 0 : 1;
const micDevice  = process.argv[3] && parseFloat(process.argv[3]) === 0 ? 0 : 1;
const rating = process.argv[4] && parseFloat(process.argv[4])
const minNoiseLevel = process.argv[5] && parseFloat(process.argv[5])
module.exports = {
  spectrumWorker: {
    minRateDiff: 10, // %
    timeToLearn: 10, // seconds
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
    switcher: 6,
  },
 // limitOfSilence: 0.2,
  DEBUG_MODE: process.env.DEBUG || true,
};
