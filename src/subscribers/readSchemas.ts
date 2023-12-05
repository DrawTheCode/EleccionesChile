import { readFileSync } from "fs-extra";
import { filterResultsFile, filterSchemasFile } from "./checkSchemas";
import { FatherZoneSchema, ZoneSchema, candidateSchema, electionsSchema, pactSchema, partiesSchema, subPactSchema } from "../types/settings";
import { dataDisplay, makeFileInputCamelCase } from "../utils/genericFunctions";

const localPath = dataDisplay();


function makeCurrentSchema(listAtr:string,type:string): ZoneSchema | FatherZoneSchema | pactSchema | subPactSchema | partiesSchema | electionsSchema | candidateSchema | null{
  const item = listAtr.split(';');
  const tempType = type.toLowerCase();
  switch (tempType) {
    case 'candidatos':
      return {
        COD_CAND:      item[0] as unknown as number,
        COD_ELEC:      item[1] as unknown as number,
        COD_ZONA:      item[2] as unknown as number,
        CAN_ORDEN:     item[3] as unknown as number,
        GLOSA_CAND:    item[4],
        COD_PART:      item[5] as unknown as number,
        COD_PACTO:     item[6] as unknown as number,
        COD_SUBP:      item[7] as unknown as number,
        COD_IND:       item[8],
        CAN_PAGINA:    item[9] as unknown as number,
        GLOSA_NOMBRE:  item[10],
        GLOSA_APELLIDO:item[11],
        COD_GENERO:    item[12]
      }
    case 'elecciones':
      return {
        COD_ELEC:   item[0] as unknown as number,
        GLOSA_ELEC: item[1],
        ELE_FECHA:  item[2],
        TIPO_ZONA:  item[3],
        TIPO_ELECCION:item[4],
        TOTAL_ELECTORES:item[5] as unknown as number
      }
    case 'pactos':
      return {
        COD_PACTO: item[0] as unknown as number,
        LETRA_PACTO:item[1],
        GLOSA_PACTO:item[2]
      }
    case 'partidos':
      return {
        COD_PART: item[0] as unknown as number,
        GLOSA_PART: item[1],
        SIGLA_PART: item[2]
      }
    case 'subpactos':
      return {
        COD_SUBP: item[0] as unknown as number,
        LETRA_PACTO: item[1],
        GLOSA_SUBP: item[2]
      }
    case 'zonas':
      return {
        COD_ZONA:item[0] as unknown as number,
        GLOSA_ZONA: item[1],
        TIPO_ZONA: item[2],
        ORDEN_ZONA: item[3] as unknown as number
      }
    case 'zonaspadre':
      return {
        COD_ZONA: item[0] as unknown as number,
        TIPO_ZONA: item[1],
        COD_ZONA_PAD: item[2] as unknown as number,
        TIPO_ZONA_PAD: item[3]
      }
    default:
      return null;
  }
}


const getScenarySchema = async (filter:string) => {
  const tempResult = await filterSchemasFile(makeFileInputCamelCase(filter));
  if(tempResult.length>0 && localPath){
    return readFileSync(`${localPath}${tempResult[0].name}`,{ encoding: 'utf8' });
  }
  return null;
}

export const getResultOneFilter = async (key:string,value:string|number) => {
  key = key.toUpperCase();
  const listKey = ['COD_ELEC','AMBITO','COD_AMBITO','COD_ZONA','TIPO_ZONA','VOTOS'];
  const tempValue = key!=='TIPO_ZONA' ? value as number : value as string;
  if(listKey.includes(key)){
    const result = await getResultsSchema();
    if(result && result?.data!==null){
      const resultList = result.data.filter((item:any)=> {
        return item[key]===tempValue;
      });
      return {details:result.details,data:resultList}
    }
  }
  return null;
}

export const getResultTwoFilter = async (firstKey:string,firstValue:string|number,secondKey:string,secondValue:string|number) => {
  firstKey = firstKey.toUpperCase();
  secondKey =secondKey.toUpperCase();
  const listKey = ['COD_ELEC','AMBITO','COD_AMBITO','COD_ZONA','TIPO_ZONA','VOTOS'];
  const tempFirstValue = firstKey!=='TIPO_ZONA' ? firstValue as number : (firstValue as string).toUpperCase();
  const tempSecondValue = secondKey!=='TIPO_ZONA' ? secondValue as number : (secondValue as string).toUpperCase();
  if(listKey.includes(firstKey) && listKey.includes(secondKey)){
    const result = await getResultsSchema();
    if(result && result?.data!==null){
      if(firstKey==='COD_ZONA' && secondKey==='TIPO_ZONA'){
        const tempResultZone = await getZoneInfo('zonas');
        if(tempResultZone.length>0){
          result.details.zone_details = tempResultZone.filter((item:any)=>{
            return(item[firstKey]===tempFirstValue && item[secondKey] === tempSecondValue);
          });
        }
      }
      const resultList = result.data.filter((item:any)=> {
        return(item[firstKey]===tempFirstValue && item[secondKey] === tempSecondValue);
      });
      return {details:result.details,data:resultList}
    }
  }
  return null;
}

export const getResultsSchema = async ()  => {
  const tempResult = await filterResultsFile();
  if(tempResult.length>0 && localPath){
    const details = tempResult[0];
    const result = await readFileSync(`${localPath}unzip/${tempResult[0].name}`,{ encoding: 'utf8' });
    const listOfLines = result.split(/;(\r\n|\r|\n)/);
    const data:any = [];
    listOfLines.forEach(line => {
      if(line && line.match(/;/)){
        const reconstructorElement = line.split(';');
        if(reconstructorElement.length===6){
          const currentElement = {
            COD_ELEC:  reconstructorElement[0],
            AMBITO:    reconstructorElement[1],
            COD_AMBITO:reconstructorElement[2],
            COD_ZONA:  reconstructorElement[3],
            TIPO_ZONA: reconstructorElement[4],
            VOTOS:     reconstructorElement[5]
          }
          data.push(currentElement);
        }
      }
    })
    return {details,data}
  }
  return null;
}

export const getZoneInfo = async (filter:string) => {
  filter = makeFileInputCamelCase(filter);
  const result = await getScenarySchema(filter);
  const tempReturn: any = []
  if(result && result.length>0){
    const listOfLines = result.split(/;(\r\n|\r|\n)/);
    listOfLines.forEach(line => {
      if(line && line.match(/;/)){
        const reconstructorElement = makeCurrentSchema(line,filter);
        if(reconstructorElement){
          tempReturn.push(reconstructorElement);
        }
      }
    })
  }
  return tempReturn;
}

export const getZoneInfoFilterByType = async (filter:string,type:string) => {
  filter = makeFileInputCamelCase(filter);
  const result = await getScenarySchema(filter);
  const tempReturn: any = []
  if(result && result.length>0){
    const listOfLines = result.split(/;(\r\n|\r|\n)/);
    listOfLines.forEach(line => {
      if(line && line.match(/;/)){
        const reconstructorElement = makeCurrentSchema(line,filter);
        if(reconstructorElement){
          tempReturn.push(reconstructorElement);
        }
      }
    })
  }
  const finalResult = tempReturn.filter((item: ZoneSchema)=>{
    return(item['TIPO_ZONA']===type.toLocaleUpperCase());
  });
  return finalResult;
}