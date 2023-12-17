import { makeResult, infoVotaciones, infoBarResults, disclaimlText, makeGenericStructure } from './genericFunctions.js';


async function makeDisplayFetch(divId,config){
  const url = config.url ?? null;
  if(url){
    fetch(url)
    .then(response => response.json()) 
    .then(data => { 
      if(data && data.data && data.data.length>0){
        const exclude = config.exclude ?? false;
        let result = {info:data.details,data:makeResult(data.data,exclude)};
        let header = config.header.txt ?? '';
        let footer = false;
        let totalMesas = config.header.totalMesas ?? false;
        let percent    = config.header.showPercent ? result.info.percent:false;
        let showHour   = config.header.showHour===true? result.info.hour : false;
        header += infoVotaciones(totalMesas,percent,showHour);
        if(config.footer!==undefined){
          if(config.footer==='default'){
            footer = disclaimlText;
          }
          if(config.footer==='bar'  && result.data){
            footer = infoBarResults(result.data.apru,result.data.rchz,result.data.vali);
          }
        }
        if(header.length===0){header=false;}
        makeGenericStructure(divId,result.data,header,footer);
      }
    })
    .catch(error => console.error(error));
  }
}

const configMainNac = {
  url:'https://apiservel.latercera.com/api/search/by/19001g',
  header:{
    txt:'<h1>RESUMEN DEL TOTAL DE MESAS Y VOTANTES</h1><h2>Resultado General de votación</h2>',
    totalMesas:39737,
    showPercent:true,
    showHour:true
  },
  footer:'bar'
}

const configNac = {
  url:'https://apiservel.latercera.com/api/search/by/8056p',
  header:{
    txt:'<h3>Nacional</h3>',
    totalMesas:39390,
  }
}

const configExtr = {
  url:'https://apiservel.latercera.com/api/search/by/type/p',
  header:{
    txt:'<h3>Extranjero</h3>',
    totalMesas:347,
  },
  exclude:'8056'
}

const configExtrExpanded = {
  url:'https://apiservel.latercera.com/api/search/by/type/p',
  header:{
    txt:'<h3>Resultado Plebiscito Constitucional</h3><p><strong>Total de votación por Extranjeros</strong></p>',
    totalMesas:347,
    showHour:true,
    showPercent:true
  },
  exclude:'8056',
  footer:'default'
}

const makeConfigData = (idZone,zoneName,qtyMesas,type) => {
  const showType = type === 'p' ? 'País' : type==='q'? 'Provincia':'Continente';
  return {
    url:`https://apiservel.latercera.com/api/search/by/${idZone}${type}`,
    header:{
      txt:`<h3>Resultado Plebiscito Constitucional</h3><p><strong>Votación por ${showType} - ${zoneName}</strong></p>`,
      totalMesas:qtyMesas,
      showHour:true,
      showPercent:true
    },
    footer:'default'
  }
}


makeDisplayFetch('global-results',configMainNac);
makeDisplayFetch('national-results',configNac);
makeDisplayFetch('international-results',configExtr);
makeDisplayFetch('international-results-expanded',configExtrExpanded);
makeDisplayFetch('international-results-europa', makeConfigData('15004','EUROPA',347,'n'));
makeDisplayFetch('international-results-francia',makeConfigData('8024','FRANCIA',12,'p'));
makeDisplayFetch('international-results-espana', makeConfigData('8019','ESPAÑA',37,'p'));
makeDisplayFetch('international-results-italia', makeConfigData('8034','ITALIA',7,'p'));
makeDisplayFetch('international-results-asia',   makeConfigData('15003','ASIA',18,'n'));
makeDisplayFetch('international-results-china',  makeConfigData('8054','REPUBLICA POPULAR CHINA',4,'p'));
makeDisplayFetch('international-results-libano', makeConfigData('8016','LIBANO',1,'p'));
makeDisplayFetch('international-results-africa', makeConfigData('15001','AFRICA',4,'n'));
makeDisplayFetch('international-results-kenia',  makeConfigData('8038','KENIA',1,'p'));
makeDisplayFetch('international-results-brasil', makeConfigData('8006','BRASIL',8,'p'));
makeDisplayFetch('international-results-oceania',makeConfigData('15005','OCEANIA',29,'n'));
makeDisplayFetch('international-results-nuevazelanda', makeConfigData('8044','NUEVA ZELANDA',8,'p'));
makeDisplayFetch('national-final-results', makeConfigData('8056','',39390,'p'));
makeDisplayFetch('national-final-arica', makeConfigData('4151','ARICA',492,'q'));
makeDisplayFetch('national-final-valparaiso', makeConfigData('4051','VALPARAISO',1832,'q'));
makeDisplayFetch('national-final-concepcion', makeConfigData('4081','CONCEPCIÓN',2203,'q'));