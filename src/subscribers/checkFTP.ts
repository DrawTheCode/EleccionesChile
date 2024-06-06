import cron from "node-cron";
import { logToFile } from "../utils/genericFunctions";
import { dataDisplay } from "../utils/genericFunctions";
import { copyFilesLocal, decompressFiles } from "./checkSchemas";
import { configDotenv } from "dotenv";

configDotenv();
const NODE_ENV = process.env.NODE_ENV ?? 'develop';
const localDataPath = dataDisplay();

async function checkFTP(dockerPath:string|false=false): Promise<string>{
  let tempConsole = '';
  tempConsole += await copyFilesLocal(dockerPath);
  const now = new Date().toLocaleString();
  tempConsole += `Última revisión de FTP => ⏱️ ${now}. \n`;
  return tempConsole;
};

async function checkUnzip(dockerPath:string|false=false): Promise<string|null>{
  let tempConsole = '';
  const unzipResult = await decompressFiles(dockerPath);
  const now = new Date().toLocaleString();
  if(unzipResult){
    tempConsole += `Último archivo descomprimido => ⏱️ ${now}. \n`;
    return tempConsole;
  }
  return `No hay archivos que descomprimir => ⏱️ ${now}. \n`;
};

cron.schedule('* * * * *', async () => {
  if(NODE_ENV==='develop'){
    console.log(await checkFTP(localDataPath));
  }else{
    logToFile(await checkFTP(localDataPath),`${localDataPath}logs/`,'crontab.log');
  }
});

cron.schedule('30 * * * * *', async () => {
  const unzipResult = await checkUnzip(localDataPath);
  if(unzipResult!==null){
    if(NODE_ENV==='develop'){
      console.log(unzipResult);
    }
    if(NODE_ENV==='production'){
      logToFile(unzipResult,`${localDataPath}logs/`,'crontab.log');
    }
  }
  
});