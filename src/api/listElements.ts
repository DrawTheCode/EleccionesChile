import express, { Request, Response } from "express";
import { configDotenv } from "dotenv";
import { zoneList } from "../config/zoneTypes";
import { checkNotCopyFiles, filterSchemasFile, getFileList } from "../subscribers/checkSchemas";
import { getResultOneFilter, getResultTwoFilter, getResultsSchema, getZoneInfo, getZoneInfoFilterByType } from "../subscribers/readSchemas";
import { election } from "../config/electionsTypes";
import { ambit } from "../config/ambitTypes";

export const zoneDefinitions = express.Router();
export const listing = express.Router();
export const results = express.Router();

configDotenv();
const accessCORS = process.env.CORS !== undefined ? process.env.CORS.split(',') : null;

function corsDefinitions(req:Request,res:Response){
  const origin = req.header('origin');
  const existInList = accessCORS && origin ? accessCORS.includes(origin):false;
  if(!origin || existInList){
    res.header("Access-Control-Allow-Origin",origin)
  }
}

zoneDefinitions.get('/zones', (req,res )=>{
  corsDefinitions(req,res);
  res.send(JSON.stringify(zoneList));
});
zoneDefinitions.get('/elec', (req,res )=>{
  corsDefinitions(req,res);
  res.send(JSON.stringify(election));
});
zoneDefinitions.get('/ambit', (req,res )=>{
  corsDefinitions(req,res);
  res.send(JSON.stringify(ambit));
});

listing.get('/files',async (req,res)=>{
  if(process.env.FTP_PATH){
    corsDefinitions(req,res);
    console.log('aca vamos=>',process.env.FTP_PATH);
    res.send(await getFileList(process.env.FTP_PATH));
  }
  return {error:'No hay ruta setteada en el sistema.'}
});

listing.get('/not-copy',async (req,res)=>{
  corsDefinitions(req,res);
  res.send(await checkNotCopyFiles());
});

listing.get('/scenery/:zone',async (req,res)=>{
  corsDefinitions(req,res);
  res.send(await filterSchemasFile(req.params.zone));
});

listing.get('/data/:zone',async (req,res)=>{
  corsDefinitions(req,res);
  res.send(await getZoneInfo(req.params.zone));
});

listing.get('/data/:zone/filter/:type',async (req,res)=>{
  corsDefinitions(req,res);
  res.send(await getZoneInfoFilterByType(req.params.zone,req.params.type));
});

results.get('/all',async (req,res) => {
  corsDefinitions(req,res);
  res.send(await getResultsSchema());
});

results.get('/filter/:key/:value',async (req,res) => {
  corsDefinitions(req,res);
  res.send(await getResultOneFilter(req.params.key,req.params.value));
});

results.get('/filter/:firstKey/:firstValue/:secondKey/:secondValue',async (req,res) => {
  corsDefinitions(req,res);
  res.send(await getResultTwoFilter(req.params.firstKey,req.params.firstValue,req.params.secondKey,req.params.secondValue));
});