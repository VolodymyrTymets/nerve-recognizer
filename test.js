const  btnNumber = process.argv[2] && parseFloat(process.argv[2]) || 21;
const  letNumber = process.argv[3] && parseFloat(process.argv[3]) || 22;
console.log('-->', `btn: ${btnNumber} led: ${letNumber}` );

try {
  const Gpio = require('onoff').Gpio;
  const btn  = new Gpio(pinNumber, 'in');
  const led  = new Gpio(pinNumber, 'out');

  btn.watch((err, value) => {
    if (err) {
      throw err;
    }
    console.log(`---> btn press ${value}`);
    led.writeSync(led.readSync() ^ 1);
  });

  process.on('SIGINT', () => {
    led.unexport();
    btn.unexport();
  });
} catch (err) {
  console.log('----> !!Error -> GPIO is not detected!!!');
  console.log(err);
}