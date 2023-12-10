import express from "express";
import { configDotenv } from "dotenv";
import { listing, results, search, zoneDefinitions } from "./api/listElements";
import cron from 'node-cron';
import { copyFilesLocal, decompressFiles } from "./subscribers/checkSchemas";

const plebiscitoReader = express();
plebiscitoReader.use(express.json());
configDotenv();


const PORT = process.env.PORT ?? '3333';

plebiscitoReader.listen(PORT, () => {
  console.log(`app running on port => ${PORT} 🚀`)
});

cron.schedule("*/30 * * * * *", function () {
  copyFilesLocal();
  decompressFiles();
  const now = new Date().toLocaleString();
  console.log(`Última revisión de FTP => ⏱️ ${now}`);
});

plebiscitoReader.use('/api/def/',zoneDefinitions);
plebiscitoReader.use('/api/check/',listing);
plebiscitoReader.use('/api/result/',results);
plebiscitoReader.use('/api/search/',search);
