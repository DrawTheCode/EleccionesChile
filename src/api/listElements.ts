import express from "express";
import { configDotenv } from "dotenv";
import { zoneList } from "../config/zoneTypes";
import { checkNotCopyFiles, filterSchemasFile, getFileList } from "../subscribers/checkSchemas";
import { getResultsSchema, getZoneInfo } from "../subscribers/readSchemas";
import { election } from "../config/electionsTypes";

export const zoneDefinitions = express.Router();
export const listing = express.Router();
export const results = express.Router();

configDotenv();

zoneDefinitions.get('/zones', (_,res )=>{
  res.send(JSON.stringify(zoneList));
});
zoneDefinitions.get('/elec', (_,res )=>{
  res.send(JSON.stringify(election));
});

listing.get('/files',async (_,res)=>{
  if(process.env.FTP_PATH){
    console.log('aca vamos=>',process.env.FTP_PATH);
    res.send(await getFileList(process.env.FTP_PATH));
  }
  return {error:'No hay ruta setteada en el sistema.'}
});

listing.get('/not-copy',async (_,res)=>{
  res.send(await checkNotCopyFiles());
});

listing.get('/scenery/:zone',async (req,res)=>{
  res.send(await filterSchemasFile(req.params.zone));
});

listing.get('/data/:zone',async (req,res)=>{
  res.send(await getZoneInfo(req.params.zone));
});

results.get('/all',async (_,res) => {
  res.send(await getResultsSchema());
});