import cron from "node-cron";
import { configDotenv } from "dotenv";
import { logToFile } from "../utils/genericFunctions";
import { copyFilesLocal, decompressFiles } from "./checkSchemas";

configDotenv();
const DATA_PATH = process.env.DATA_PATH ?? '/home/app/';

async function check(dockerPath:string|false=false): Promise<string>{
  let tempConsole = '';
  tempConsole += await copyFilesLocal(dockerPath);
  tempConsole += decompressFiles(dockerPath);
  const now = new Date().toLocaleString();
  tempConsole += `Última revisión de FTP => ⏱️ ${now}. \n`;
  return tempConsole;
};

cron.schedule('* * * * *', async () => {
  logToFile(await check(DATA_PATH),`${DATA_PATH}/data/logs/`,'crontab.log');
});