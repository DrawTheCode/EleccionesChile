import fs from "fs";
import { fileResultsShcemas, fileShcemas } from "../types/settings";
import { readFileSync, writeFile } from "fs-extra";
import { configDotenv } from "dotenv";

configDotenv();

const DATA_PATH = process.env.DATA_PATH ?? '/home/app/';

export function makeFolderIfNotExist(dir:string){
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir,{recursive:true,mode:777});
  }
}

//esto lo hice porque en la ruta puede venir tanto como mayus como sin ellas
export function makeFileInputCamelCase(name:string):string{
  switch (name.toLowerCase()) {
    case 'candidatos':
      return 'Candidatos';
    case 'elecciones':
      return 'Elecciones';
    case 'pactos':
      return 'Pactos';
    case 'partidos':
      return 'Partidos';
    case 'subpactos':
      return 'SubPactos';
    case 'zonas':
      return 'Zonas';
    case 'zonaspadre':
      return 'ZonasPadre'
    default:
      return name;
  }
}

export function logToFile(logMessage:string,logPath:string,logName:string) {
  if(logPath.match(/\/$/)===null){
    logPath = `${logPath}/`;
  }
  if(logName.match(/^\//)){
    logName = logName.substring(1,(logName.length - 1));
  }
  const logStream = fs.createWriteStream(`${logPath}${logName}`, { flags: 'a' });
  logStream.write(`${logMessage}\n`);
  logStream.end();
}

export function makeFileShcema(nameFile:string, filter:string): fileShcemas | null {
  const firstFilter = new RegExp(`Escenario_${filter}_`);
  if(nameFile.match(firstFilter)){
    const firstCut = nameFile.split(firstFilter);
    if(firstCut[1].match(/.(txt|TXT)$/)!==null){
      const secondCut = firstCut[1].split(/.(txt|TXT)$/);
      return {  
        name: nameFile,
        id: secondCut[0] as unknown as number,
        version: secondCut[0].substring(0,3) as unknown as number,
        correlative: secondCut[0].substring(3,6) as unknown as number
      }
    }
  }
  return null;
}

export function makeFileResultShcema(nameFile:string,elecID:number): fileResultsShcemas | null {
  const firstFilter = new RegExp(`VOTACION_${elecID}_`);
  if(nameFile.match(firstFilter)){
    const firstCut = nameFile.split(firstFilter);
    if(firstCut[1].match(/.(txt|TXT)$/)!==null){
      const secondCut = firstCut[1].split(/.(txt|TXT)$/);
      const thirdCut = secondCut[0].split(/_/);
      function sizeTextPercent(value:string):number{
        let divisor = 100;
        if(value.length===6){divisor=1000;}
        if(value.length===4){divisor=10;}
        return(parseInt(value)/divisor);
      }
      return {  
        name: nameFile,
        id: `${thirdCut[0]}${thirdCut[1]}` as unknown as number,
        percent: sizeTextPercent(thirdCut[0]),
        hour: `${thirdCut[1].substring(0,2)}:${thirdCut[1].substring(2,4)}`
      }
    }
  }
  return null;
}

export async function makeAErrorLogFile(path:string,nameFile:string,error:string){
  if(path.match(/\/$/)!==null){path=path+'/'}
  if(nameFile.match(/^\//)!==null){nameFile=nameFile.substring(1,nameFile.length)}
  const filePath = path+'/'+nameFile;
  const errorCounts = `${error};\n`;
  if(fs.existsSync(filePath)){
    const content = await readFileSync(filePath,{ encoding: 'utf8' });
    if(content.length>0){
      const errorItems = content.split(/;\n/);
      errorItems.push(error);
      let data = "";
      errorItems.forEach((error)=>{
        if(error.length>0){
          data +=  `${error}\n`;
        }
      });
      await writeFile(filePath,data);
      console.error(`Se a modificado el archivo de ${nameFile} ✔️`);
      return null;
    }
  }
  await writeFile(filePath,errorCounts);
  console.error(`Se a creado el archivo de ${nameFile} ❌`);
  return null;
}

export function dataDisplay(){
  const curatedPath = DATA_PATH.substring(DATA_PATH.length - 1) === '/' ? DATA_PATH:`${DATA_PATH}/`;
  const dataFolder = `${curatedPath}data/`;
  makeFolderIfNotExist(dataFolder);
  return dataFolder;
};