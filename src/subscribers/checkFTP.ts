import cron from "node-cron";
import { logToFile } from "../utils/genericFunctions";
import { dataDisplay } from "../utils/genericFunctions";
import { copyFilesLocal, decompressFiles } from "./checkSchemas";

async function check(dockerPath:string|false=false): Promise<string>{
  let tempConsole = '';
  tempConsole += await copyFilesLocal(dockerPath);
  tempConsole += decompressFiles(dockerPath);
  const now = new Date().toLocaleString();
  tempConsole += `Última revisión de FTP => ⏱️ ${now}. \n`;
  return tempConsole;
};

cron.schedule('* * * * *', async () => {
  const localDataPath = dataDisplay();
  logToFile(await check(localDataPath),`${localDataPath}logs/`,'crontab.log');
});