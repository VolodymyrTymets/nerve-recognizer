const { mean } = require('lodash');
const config = require('./config');
const { colors } = require('./src/utils/colors');
const { Mic } = require('./src/utils/Mic');
const { Segmenter } = require('./src/utils/segmenter');
const { getSpectrumInfo } = require('./src/utils/fft/getSpectrumInfo');
const { notify } = require('./src/utils/notifier');

let MIC_DETECTED = false;

const startRecord = () => {
  const mic = new Mic(config);
  if(global.mic) {
    mic.stop();
  }
  global.mic = mic;

  const recordTine = new Date();
  const segmenter = new Segmenter(recordTine, config);

  mic.start(recordTine, (audioData) => {
    const wave = audioData.channelData[0];
    if (mean(wave) < config.limitOfSilence) {
      MIC_DETECTED = false;
    } else {
      MIC_DETECTED = true;
    }
    segmenter.findSegment(wave);
  });

  segmenter.on('segment', (segment) => {
    const { spectrum, energy, tissueType, maxIndex } = getSpectrumInfo(segment, config);

    if(tissueType === 'nerve') {
      if (config.DEBUG_MODE) {
        console.log(colors.BgGreen, `>> energy:${energy}: maxSpectrum: ${spectrum[maxIndex]}`)
      }
      notify.nerveNotify();
    } else {
      if (config.DEBUG_MODE) {
        console.log(colors.BgBlue, `>> energy:${energy}: maxSpectrum: ${spectrum[maxIndex]}`)
      }
    }
  });
};

const stopRecord = () => {
  if(global.mic) {
    mic.stop();
  }
};

startRecord();

if (config.DEBUG_MODE) {
  notify.soundNotify();
}

setInterval(() => {
  if (MIC_DETECTED) {
    notify.recNotify(1);
  } else {
    if (config.DEBUG_MODE) {
      console.log(colors.FgRed, '--> NO data from mic')
    }
    notify.recNotify(0);
  }
}, 1000);


process.on('exit', (code) => {
  stopRecord();
  console.log(`By by =)`);
});

