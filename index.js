const { mean, max } = require('lodash');
const config = require('./config');
const { colors } = require('./src/utils/colors');
const { Mic } = require('./src/utils/Mic');
const { Segmenter } = require('./src/utils/segmenter');
const { getSpectrumInfo } = require('./src/utils/fft/getSpectrumInfo');
const { notify } = require('./src/utils/notifier');

let limitsOfSilence = [];

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
    limitsOfSilence.push(mean(wave.map(Math.abs)));
    segmenter.findSegment(wave);
  });

  segmenter.on('segment', (segment) => {
    const { spectrum, energy, tissueType } = getSpectrumInfo(segment, config);
    if(tissueType === 'nerve') {
      notify.nerveNotify();
    }
    if (config.DEBUG_MODE) {
      console.log(`>> muscle:${energy}: maxSpectrum: ${max(spectrum)}`)
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
  const meanLimitOfSilence = mean(limitsOfSilence);
  //console.log('meanLimitOfSilence ->', { meanLimitOfSilence, c: config.limitOfSilence })
  if (meanLimitOfSilence > config.limitOfSilence) {
    notify.recNotify(1);
  } else {
    if (config.DEBUG_MODE) {
       console.log(colors.FgRed, '--> NO data from mic')
    }
    notify.recNotify(0);
  }
  limitsOfSilence = [];
}, 2000);


process.on('exit', (code) => {
  stopRecord();
  console.log(`By by =)`);
});

