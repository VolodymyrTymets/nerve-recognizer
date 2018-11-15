const findTone = (wave, tone = 500, sampleRate = 44100) => {
  let amplitudeSin = 0;
  let amplitudeCos = 0;
  const sampleSize = wave.length;
  for (let i = 0; i < wave.length; i++) {
    amplitudeSin += wave[i] * (Math.sin(2 * Math.PI * tone / sampleRate * i) / Math.sqrt(sampleSize));
    amplitudeCos += wave[i] * (Math.cos(2 * Math.PI * tone / sampleRate * i) / Math.sqrt(sampleSize));
  }
  return Math.sqrt(amplitudeSin*amplitudeSin + amplitudeCos * amplitudeCos);
};

const findNoiseLevel = (wave) => {
  let power = 0;
  let average = 0;
  for (let i = 0; i < wave.length; i++) {
    average += wave[i];
  }
  average /= wave.length;
  for (var i = 0; i < wave.length; i++) {
    power += Math.pow(wave[i] - average, 2);
  }
  return Math.sqrt(power);
};

module.exports = { findNoiseLevel, findTone };