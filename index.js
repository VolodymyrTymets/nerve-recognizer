const config = require('./config');
const { colors } = require('./src/utils/colors');
const { NERVE, MUSCLE } = require('./src/constants');
const { Mic } = require('./src/utils/Mic');
const { SpectrumWorker } = require('./src/utils/fft/SpectrumWorker');
const { notify } = require('./src/utils/notifier');

let switcher = null;

const spectrumWorker = new SpectrumWorker(config);
spectrumWorker.on(NERVE, notify.nerveNotify);
spectrumWorker.on(MUSCLE, notify.muscleNotify);

const stopRecord = () => {
  if(global.mic) {
    mic.stop();
    notify.micNotify(0);
    spectrumWorker.stop();
  }
};
const startRecord = () => {
  if(global.mic) {
    console.log(`Run: mic:${config.mic.device} gpio: [mic:${config.gpio.mic} nerve:${config.gpio.nerve} muscle:${config.gpio.muscle}]`)
    mic.start();
    notify.micNotify(1);
  }
};

global.mic = new Mic(config, (audioData) => {
  const wave = audioData.channelData[0];
  spectrumWorker.start(wave);
});


try {
  const Gpio = require('onoff').Gpio;
  const switcher  = new Gpio(config.gpio.switcher, 'in');
  switcher.watch((err, value) => {
    if (err) { console.log(err) }
    if (value) {
      config.DEBUG_MODE && console.log(colors.FgBlue, `[Switch] ---> [${value}]`);
      startRecord();
    } else {
      config.DEBUG_MODE && console.log(colors.FgBlue, `[Switch] ---> [${value}]`);
      stopRecord();
    }
  });
} catch (e) {
  console.log('----> !!Error -> GPIO is not detected!!!');
  startRecord();
}

process.on('exit', () => {
  stopRecord();
  notify.gpioOff();
  notify.clear();
  switcher.unexport();
  console.log(colors.FgWhite,'<----by by----->');
});
process.on('SIGINT', async () => process.exit());
