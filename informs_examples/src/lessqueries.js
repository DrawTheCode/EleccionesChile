import { infoVotaciones, disclaimlText, infoBarResults, makeGenericStructure, makeResult } from './genericFunctions.js';


 const getData = async (url) => {
  if(url){
    const results = await fetch(url);
    return await results.json() ?? null;
  }
}
const globalResults = await getData('https://apiservel.latercera.com/api/result/filter/tipo_zona/g');
const countryResults = await getData('https://apiservel.latercera.com/api/result/filter/tipo_zona/p');
const continentResult = await getData('https://apiservel.latercera.com/api/result/filter/tipo_zona/n');
const regionResult = await getData('https://apiservel.latercera.com/api/result/filter/tipo_zona/q');

const makeConfigData = (idZone,zoneName,qtyMesas,typeID) => {
  if(typeID.match(/^(g|p|n|q)$/)!==null){
    const showType = typeID === 'p' ? 'País' : typeID==='q'? 'Provincia':'Continente';
    return {
      zone:idZone,
      type:typeID,
      header:{
        txt:`<h3>Resultado Plebiscito Constitucional</h3><p><strong>Votación por ${showType} - ${zoneName}</strong></p>`,
        totalMesas:qtyMesas,
        showHour:true,
        showPercent:true
      },
      footer:'default'
    }
  }
}

const makeDisplayFetch = async (divID,config) => {
  if(config.type && config.type.match(/^(g|p|n|q)$/)!==null){
    let results;
    if(config.type==='g'){ results = await { ...globalResults};}
    if(config.type==='p'){ results = await { ...countryResults};}
    if(config.type==='n'){ results = await { ...continentResult};}
    if(config.type==='q'){ results = await { ...regionResult};}
    const extractData = await results.data.filter((element)=>{
      return((!config.zone || element.COD_ZONA===config.zone) && element.TIPO_ZONA===config.type.toUpperCase() && (config.exclude===undefined || element.COD_ZONA===config.exclude));
    });
    let tempResult = {info:await results.details,data: makeResult(await extractData)};
    //console.log(divID,await tempResult,'====>',await extractData);
    //console.log(divID,await tempResult,'====>',await extractData);
    if(await tempResult.data !== undefined){
      let header = config.header.txt ?? '';
      let footer = false;
      let totalMesas = config.header.totalMesas ?? false;
      let percent    = config.header.showPercent ? tempResult.info.percent:false;
      let showHour   = config.header.showHour===true? tempResult.info.hour : false;
      header += infoVotaciones(totalMesas,percent,showHour);
      if(config.footer!==undefined){
        if(config.footer==='default'){
          footer = disclaimlText;
        }
        if(config.footer==='bar'  && tempResult.data){
          footer = infoBarResults(tempResult.data.apru,tempResult.data.rchz,tempResult.data.vali);
        }
      }
      if(header.length===0){header=false;}
      //console.log('ESTAMOS EN =>',divID,' TENEMOS=> ',await tempResult);
      makeGenericStructure(divID,await tempResult.data,header,footer);
    }
  }
}

//uniques config
const configMainNac = {
  zone:'19001',
  type:'g',
  header:{
    txt:'<h1>RESUMEN DEL TOTAL DE MESAS Y VOTANTES</h1><h2>Resultado General de votación</h2>',
    totalMesas:39737,
    showPercent:true,
    showHour:true
  },
  footer:'bar'
}

const configNac = {
  zone:'8056',
  type:'p',
  header:{
    txt:'<h3>Nacional</h3>',
    totalMesas:39390,
  }
}

const configExtr = {
  zone:false,
  type:'p',
  header:{
    txt:'<h3>Extranjero</h3>',
    totalMesas:347,
  },
  exclude:'8056'
}

const configExtrExpanded = {
  zone:false,
  type:'p',
  header:{
    txt:'<h3>Resultado Plebiscito Constitucional</h3><p><strong>Total de votación por Extranjeros</strong></p>',
    totalMesas:347,
    showHour:true,
    showPercent:true
  },
  exclude:'8056',
  footer:'default'
}


makeDisplayFetch('global-results',configMainNac);
makeDisplayFetch('national-results',configNac);
makeDisplayFetch('international-results',configExtr);
makeDisplayFetch('international-results-expanded',configExtrExpanded);
makeDisplayFetch('international-results-francia',makeConfigData('8024','FRANCIA',12,'p'));
makeDisplayFetch('international-results-espana', makeConfigData('8019','ESPAÑA',37,'p'));
makeDisplayFetch('international-results-italia', makeConfigData('8034','ITALIA',7,'p'));
makeDisplayFetch('international-results-kenia',  makeConfigData('8038','KENIA',1,'p'));
makeDisplayFetch('international-results-asia',   makeConfigData('15003','ASIA',18,'n'));
makeDisplayFetch('international-results-libano', makeConfigData('8016','LIBANO',1,'p'));
makeDisplayFetch('international-results-china',  makeConfigData('8054','REPUBLICA POPULAR CHINA',4,'p'));
makeDisplayFetch('international-results-nuevazelanda', makeConfigData('8044','NUEVA ZELANDA',8,'p'));
makeDisplayFetch('international-results-brasil', makeConfigData('8006','BRASIL',8,'p'));
makeDisplayFetch('international-results-africa', makeConfigData('15001','AFRICA',4,'n'));
makeDisplayFetch('international-results-europa', makeConfigData('15004','EUROPA',347,'n'));
makeDisplayFetch('international-results-oceania',makeConfigData('15005','OCEANIA',29,'n'));
makeDisplayFetch('national-final-arica', makeConfigData('4151','ARICA',492,'q'));
makeDisplayFetch('national-final-valparaiso', makeConfigData('4051','VALPARAISO',1832,'q'));
makeDisplayFetch('national-final-concepcion', makeConfigData('4081','CONCEPCIÓN',2203,'q'));
makeDisplayFetch('national-final-results', makeConfigData('8056','',39390,'p'));