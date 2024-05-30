import { copyFilesLocal, decompressFiles } from "./checkSchemas";
import { logToFile } from "../utils/genericFunctions";
import cron from "node-cron";

const DATA_PATH = process.env.DATA_PATH ?? '/hone/app/';

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