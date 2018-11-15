const path = require('path');
const moment = require('moment');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const { NERVE, MUSCLE } = require('../constants');


const lists = {
  [NERVE]: [],
  [MUSCLE]: [],
};

const pushToReport = (noiseLevel, energy, maxSpectrum) => (type) => lists[type].push({ noiseLevel, energy, maxSpectrum });
const getFromReport = (type) => lists[type];
const clearReport = (type) => lists[type];

const saveIntoCsv = (list, type) => {
  const csvWriter = createCsvWriter({
    path: path.resolve(__dirname, `../assets/out/${type}`, `${moment().format('YYYY-MM-DD_H:mm')}.csv`),
    header: [
      {id: 'noiseLevel', title: 'Noise level'},
      {id: 'energy', title: 'Energy'},
      {id: 'maxSpectrum', title: 'Max Spectrum'},
    ]
  });
  return csvWriter.writeRecords(list)
};

module.exports = { saveIntoCsv, pushToReport, getFromReport, clearReport };
