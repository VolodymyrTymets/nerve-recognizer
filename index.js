const { mean, max } = require('lodash');
const config = require('./config');
const { colors } = require('./src/utils/colors');
const { Mic } = require('./src/utils/Mic');
const { Segmenter } = require('./src/utils/segmenter');
const { getSpectrumInfo } = require('./src/utils/fft/getSpectrumInfo');
const { notify } = require('./src/utils/notifier');
const { findNoiseLevel } = require('./src/utils/silence-detect');
const { NERVE, MUSCLE } = require('./src/constants');


let noiseLevels = [];
let MIC_IS_RUN = false;
let COUNT_OF_TRY_TO_LISTEN = 0;

let statOfListen = null;
let spectrums = [];
let energies = [];
let MEAN_ENERGY = null;
let MEAN_SPECTRUM = null;

const stopRecord = () => {
  if(global.mic) {
    mic.stop();
    MIC_IS_RUN = false;
    COUNT_OF_TRY_TO_LISTEN = 0;
    notify.micNotify(0);
  }
};
const startRecord = () => {
  if(global.mic) {
    mic.start();
    MIC_IS_RUN = true;
  }
};


// Segment part
const segmenter = new Segmenter(config.segmenter);
segmenter.on('segment', (segment) => {
  const noiseLevel = mean(noiseLevels);
  if(!MIC_IS_RUN) {
    return;
  }

  statOfListen = statOfListen || new Date().getTime();
  const { spectrum, energy, tissueType, rating } = getSpectrumInfo(segment, noiseLevel, config);
  const maxSpectrum = max(spectrum);
  // const pushToReportF = pushToReport(noiseLevel, energy, maxSpectrum);

  const diffInSec = (new Date().getTime() - statOfListen ) / 1000;

  if(diffInSec > 10) {
    console.log(colors.FgGreen,
      `-->  E: ${energy} / [${MEAN_ENERGY}] S: ${maxSpectrum} /[${MEAN_SPECTRUM}]`);
  } else {
    spectrums.push(maxSpectrum);
    energies.push(energy);
    MEAN_SPECTRUM = mean(spectrums);
    MEAN_ENERGY = mean(energies);
    console.log(colors.FgWhite,
      `--> listening [${diffInSec}] E: ${energy} / [${MEAN_ENERGY}] S: ${maxSpectrum} /[${MEAN_SPECTRUM}]`);
  }

});

// Mic part
global.mic = new Mic(config, (audioData) => {
  const wave = audioData.channelData[0];
  const noiseLevel = findNoiseLevel(wave);
  noiseLevels.push(noiseLevel);
  segmenter.findSegment(wave);
});

startRecord();
setInterval(() => {
  const noiseLevel = mean(noiseLevels) || 0;
  noiseLevels = [];

  if(noiseLevel < config.fft.minNoiseLevel) {
    !MIC_IS_RUN ? startRecord() : stopRecord();
  }
  COUNT_OF_TRY_TO_LISTEN = COUNT_OF_TRY_TO_LISTEN !== 3 ? COUNT_OF_TRY_TO_LISTEN + 1 : 3;
  notify.micNotify(COUNT_OF_TRY_TO_LISTEN === 3 ? 1 : 0);
}, 2000);

console.log(`Run: mic:${config.mic.device} noise: ${config.fft.minNoiseLevel} rating: ${config.fft.rating} gpio: [mic:${config.gpio.mic} nerve:${config.gpio.nerve} muscle:${config.gpio.muscle}]`)


process.on('exit', () => {
  stopRecord();
  notify.gpioOff();
  console.log(colors.FgWhite,'<----by by----->');
});
process.on('SIGINT', async () => process.exit());
