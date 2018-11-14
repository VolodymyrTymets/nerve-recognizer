const { sum, max, mean } = require('lodash');
const config = require('./config');
const { colors } = require('./src/utils/colors');
const { Mic } = require('./src/utils/Mic');
const { Segmenter } = require('./src/utils/segmenter');
const { getSpectrumInfo } = require('./src/utils/fft/getSpectrumInfo');
const { notify } = require('./src/utils/notifier');

let limitsOfSilence = [];
let MIC_RUNED = true;

const startRecord = () => {
  const mic = new Mic(config);
  if(global.mic) {
    mic.stop();
  }
  global.mic = mic;

  const recordTine = new Date();
  const segmenter = new Segmenter(config.segmenter);

  mic.start(recordTine, (audioData) => {
    const wave = audioData.channelData[0];
    limitsOfSilence.push(max(wave));
    segmenter.findSegment(wave);
  });

  segmenter.on('segment', (segment) => {
    const { spectrum, energy, tissueType } = getSpectrumInfo(segment, config);
    if(tissueType === 'nerve') {
      notify.nerveNotify();
    }
    if (config.DEBUG_MODE) {
      console.log(`>> ${tissueType}:${energy}: maxSpectrum: ${max(spectrum)}`)
    }
  });
};

const stopRecord = () => {
  if(global.mic) {
    mic.stop();
    MIC_RUNED = false;
  }
};



if (config.DEBUG_MODE) {
  notify.soundNotify();
}

setInterval(() => {
  const meanLimitOfSilence = mean(limitsOfSilence.map(Math.abs));
  console.log('meanLimitOfSilence ->', meanLimitOfSilence)
  if (meanLimitOfSilence > config.limitOfSilence) {
    notify.recNotify(1);
  } else {
    if (config.DEBUG_MODE) {
       console.log('--> NO data from mic');
    }
    stopRecord();
    notify.recNotify(0);
  }
  limitsOfSilence = [];
  if(!MIC_RUNED) {
    startRecord();
  }
}, 2000);


process.on('exit', (code) => {
  stopRecord();
  console.log(`By by =)`);
});


startRecord();
