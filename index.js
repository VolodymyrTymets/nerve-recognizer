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

const stopRecord = () => {
  if(global.mic) {
    mic.stop();
    MIC_IS_RUN = false;
    notify.micNotify(0);
  }
};
const startRecord = () => {
  if(global.mic) {
    mic.start();
    MIC_IS_RUN = true;
    notify.micNotify(1);
  }
};
// Segment part
const segmenter = new Segmenter(config.segmenter);
segmenter.on('segment', (segment) => {
  const { spectrum, energy, tissueType } = getSpectrumInfo(segment, config);
  if(tissueType === NERVE) {
    notify.nerveNotify();
  }
  if(tissueType === MUSCLE) {
    notify.muscleNotify();
  }
  if (config.DEBUG_MODE) {
    console.log(tissueType == NERVE ? colors.FgBlue : colors.FgGreen,
      `>> ${tissueType}:${energy}: maxSpectrum: ${max(spectrum)}`)
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
  const noiseLevel = mean(noiseLevels);
  noiseLevels = [];
  if(noiseLevel < config.limitOfSilence) {
    !MIC_IS_RUN ? startRecord() : stopRecord();
  }
  //console.log(MIC_IS_RUN ? colors.FgGreen : colors.FgRed ,`noiseLevel ${MIC_IS_RUN} ->`, noiseLevel);
}, 2000);

process.on('exit', stopRecord);

console.log(`Run: mic:${config.mic.device} energy: ${config.fft.minEnergy} gpio: [mic:${config.gpio.mic} nerve:${config.gpio.nerve} muscle:${config.gpio.muscle}]`)