import {
  infoVotaciones,
  disclaimlText,
  infoBarResults,
  makeGenericStructure,
} from './genericFunctions.js';

const elecID = 1; // Set the desired ElecID here

const getData = async url => {
  if (url) {
    const results = await fetch(url);
    return (await results.json()) ?? null;
  }
};

const globalResults = await getData(
  `https://apiservel.latercera.com/api/search/${elecID}/by/type/g`,
);
const countryResults = await getData(
  `https://apiservel.latercera.com/api/search/${elecID}/by/type/p`,
);
const continentResult = await getData(
  `https://apiservel.latercera.com/api/search/${elecID}/by/type/n`,
);
const regionResult = await getData(
  `https://apiservel.latercera.com/api/search/${elecID}/by/type/q`,
);

function makeResult(data, exclude = false) {
  if (data.size > 0) {
    let nuloEmitidos = 0;
    let blcoEmitidos = 0;
    let valiEmitidos = 0;
    let apruEmitidos = 0;
    let rchzEmitidos = 0;
    data.forEach(element => {
      if (!exclude || element.COD_ZONA !== exclude) {
        if (element.COD_AMBITO === '1' && element.AMBITO === '5') {
          nuloEmitidos += parseInt(element.VOTOS);
        }
        if (element.COD_AMBITO === '1' && element.AMBITO === '6') {
          blcoEmitidos += parseInt(element.VOTOS);
        }
        if (element.COD_AMBITO === '1' && element.AMBITO === '7') {
          valiEmitidos += parseInt(element.VOTOS);
        }
        if (element.COD_AMBITO === '100001' && element.AMBITO === '4') {
          apruEmitidos += parseInt(element.VOTOS);
        }
        if (element.COD_AMBITO === '100002' && element.AMBITO === '4') {
          rchzEmitidos += parseInt(element.VOTOS);
        }
      }
    });
    return {
      nulo: nuloEmitidos,
      blco: blcoEmitidos,
      vali: valiEmitidos,
      apru: apruEmitidos,
      rchz: rchzEmitidos,
    };
  }
}

const makeConfigData = (elecID, idZone, zoneName, qtyMesas, typeID) => {
  if (typeID.match(/^(g|p|n|q)$/) !== null) {
    const showType =
      typeID === 'p' ? 'País' : typeID === 'q' ? 'Provincia' : 'Continente';
    return {
      zone: idZone,
      type: typeID,
      header: {
        txt: `<h3>Resultado Plebiscito Constitucional</h3><p><strong>Votación por ${showType} - ${zoneName}</strong></p>`,
        totalMesas: qtyMesas,
        showHour: true,
        showPercent: true,
      },
      footer: 'default',
    };
  }
};

const getDataFromList = (data, config) => {
  if (config.exclude !== undefined) {
    delete data[config.exclude];
  }
  console.log(data);
  return data;
};

const makeDataByZoneID = (results, config) => {
  if (config.zone !== false) {
    return makeResult(results.data[config.zone]);
  } else {
    const temporalData = [...getDataFromList(results.data, config.exclude)];
    console.log('ITEM=>', temporalData);
    if (temporalData.length > 0) {
      let nuloEmitidos = 0;
      let blcoEmitidos = 0;
      let valiEmitidos = 0;
      let apruEmitidos = 0;
      let rchzEmitidos = 0;
      temporalData.forEach(item => {
        item.forEach(element => {
          if (element.COD_AMBITO === '1' && element.AMBITO === '5') {
            nuloEmitidos += parseInt(element.VOTOS);
          }
          if (element.COD_AMBITO === '1' && element.AMBITO === '6') {
            blcoEmitidos += parseInt(element.VOTOS);
          }
          if (element.COD_AMBITO === '1' && element.AMBITO === '7') {
            valiEmitidos += parseInt(element.VOTOS);
          }
          if (element.COD_AMBITO === '100001' && element.AMBITO === '4') {
            apruEmitidos += parseInt(element.VOTOS);
          }
          if (element.COD_AMBITO === '100002' && element.AMBITO === '4') {
            rchzEmitidos += parseInt(element.VOTOS);
          }
        });
      });
      const result = {
        nulo: nuloEmitidos,
        blco: blcoEmitidos,
        vali: valiEmitidos,
        apru: apruEmitidos,
        rchz: rchzEmitidos,
      };
      return result;
    }
  }
};

const makeDisplayFetch = async (divID, config) => {
  if (config.type && config.type.match(/^(g|p|n|q)$/) !== null) {
    let results;
    if (config.type === 'g') {
      results = await { ...globalResults };
    }
    if (config.type === 'p') {
      results = await { ...countryResults };
    }
    if (config.type === 'n') {
      results = await { ...continentResult };
    }
    if (config.type === 'q') {
      results = await { ...regionResult };
    }
    const extractData = makeDataByZoneID(await results, config);
    let tempResult = {
      info: await results.details,
      data: await { ...extractData },
    };
    console.log(await tempResult);
    if ((await tempResult.data) !== undefined) {
      let header = config.header.txt ?? '';
      let footer = false;
      let totalMesas = config.header.totalMesas ?? false;
      let percent = config.header.showPercent ? tempResult.info.percent : false;
      let showHour =
        config.header.showHour === true ? tempResult.info.hour : false;
      header += infoVotaciones(totalMesas, percent, showHour);
      if (config.footer !== undefined) {
        if (config.footer === 'default') {
          footer = disclaimlText;
        }
        if (config.footer === 'bar' && tempResult.data) {
          footer = infoBarResults(
            tempResult.data.apru,
            tempResult.data.rchz,
            tempResult.data.vali,
          );
        }
      }
      if (header.length === 0) {
        header = false;
      }
      makeGenericStructure(divID, await tempResult.data, header, footer);
    }
  }
};

//uniques config
const configMainNac = {
  zone: '19001',
  type: 'g',
  header: {
    txt: '<h1>RESUMEN DEL TOTAL DE MESAS Y VOTANTES</h1><h2>Resultado General de votación</h2>',
    totalMesas: 39737,
    showPercent: true,
    showHour: true,
  },
  footer: 'bar',
};

const configNac = {
  zone: '8056',
  type: 'p',
  header: {
    txt: '<h3>Nacional</h3>',
    totalMesas: 39390,
  },
};

const configExtr = {
  zone: false,
  type: 'p',
  header: {
    txt: '<h3>Extranjero</h3>',
    totalMesas: 347,
  },
  exclude: '8056',
};

const configExtrExpanded = {
  zone: false,
  type: 'p',
  header: {
    txt: '<h3>Resultado Plebiscito Constitucional</h3><p><strong>Total de votación por Extranjeros</strong></p>',
    totalMesas: 347,
    showHour: true,
    showPercent: true,
  },
  exclude: '8056',
  footer: 'default',
};

makeDisplayFetch('global-results', configMainNac);
makeDisplayFetch('national-results', configNac);
makeDisplayFetch('international-results', configExtr);
makeDisplayFetch('international-results-expanded', configExtrExpanded);
makeDisplayFetch(
  'international-results-francia',
  makeConfigData(elecID, '8024', 'FRANCIA', 12, 'p'),
);
makeDisplayFetch(
  'international-results-espana',
  makeConfigData(elecID, '8019', 'ESPAÑA', 37, 'p'),
);
makeDisplayFetch(
  'international-results-italia',
  makeConfigData(elecID, '8034', 'ITALIA', 7, 'p'),
);
makeDisplayFetch(
  'international-results-kenia',
  makeConfigData(elecID, '8038', 'KENIA', 1, 'p'),
);
makeDisplayFetch(
  'international-results-asia',
  makeConfigData(elecID, '15003', 'ASIA', 18, 'n'),
);
makeDisplayFetch(
  'international-results-libano',
  makeConfigData(elecID, '8016', 'LIBANO', 1, 'p'),
);
makeDisplayFetch(
  'international-results-china',
  makeConfigData(elecID, '8054', 'REPUBLICA POPULAR CHINA', 4, 'p'),
);
makeDisplayFetch(
  'international-results-nuevazelanda',
  makeConfigData(elecID, '8044', 'NUEVA ZELANDA', 8, 'p'),
);
makeDisplayFetch(
  'international-results-brasil',
  makeConfigData(elecID, '8006', 'BRASIL', 8, 'p'),
);
makeDisplayFetch(
  'international-results-africa',
  makeConfigData(elecID, '15001', 'AFRICA', 4, 'n'),
);
makeDisplayFetch(
  'international-results-europa',
  makeConfigData(elecID, '15004', 'EUROPA', 347, 'n'),
);
makeDisplayFetch(
  'international-results-oceania',
  makeConfigData(elecID, '15005', 'OCEANIA', 29, 'n'),
);
makeDisplayFetch(
  'national-final-arica',
  makeConfigData(elecID, '4151', 'ARICA', 492, 'q'),
);
makeDisplayFetch(
  'national-final-valparaiso',
  makeConfigData(elecID, '4051', 'VALPARAISO', 1832, 'q'),
);
makeDisplayFetch(
  'national-final-concepcion',
  makeConfigData(elecID, '4081', 'CONCEPCIÓN', 2203, 'q'),
);
makeDisplayFetch(
  'national-final-results',
  makeConfigData(elecID, '8056', '', 39390, 'p'),
);
