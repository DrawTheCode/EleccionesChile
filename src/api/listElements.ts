import express, { Request, Response } from "express";
import responseTime from "response-time";
import { configDotenv } from "dotenv";
import { zoneList } from "../config/zoneTypes";
import { checkNotCopyFiles, filterSchemasFile, getFileList } from "../subscribers/checkSchemas";
import { getResultOneFilter, getResultTwoFilter, getResultsSchema, getSearch, getSearchByType, getSearchByTypeAndID, getZoneInfo, getZoneInfoFilterByType } from "../subscribers/readSchemas";
import { election } from "../config/electionsTypes";
import { ambit } from "../config/ambitTypes";
import {createClient} from 'redis';

export const zoneDefinitions = express.Router();
export const listing = express.Router();
export const results = express.Router();
export const search = express.Router();

search.use(responseTime());

configDotenv();
const accessCORS = process.env.CORS !== undefined ? process.env.CORS.split(',') : null;
const REDIS_URL = process.env.REDIS_URL !== undefined ? process.env.REDIS_URL : null;

async function setRegisterRedis(key:string,data:string){
  if(REDIS_URL){
    try {
      const client = await createClient({url: REDIS_URL})
        .on('error', err => console.log('Redis Client Error', err))
        .connect();
      await client.set(key,data);
      await client.disconnect();
    } catch (error) {
      console.error('ERROR=>',error);
    }
  }
  return null;
}

async function getRegisterRedis(key:string):Promise <string|null>{
  if(REDIS_URL){
    try {
      console.log('estamos aca');
      const client = await createClient({url: REDIS_URL})
        .on('error',err => console.log('Redis Client Error => ', err))
        .connect();
      const result = await client.get(key);
      await client.disconnect();
      return result;
    } catch (error) {
      console.error('ERROR=>',error);
    }
  }
  return null;
}

function corsDefinitions(req:Request,res:Response){
  let origin = req.header('referer');
  if(typeof origin === 'string' && origin.match(/\/$/)!==null){
    origin = origin.replace(/\/$/,'');
  }
  if(origin && accessCORS && accessCORS.includes(origin)){
    res.header('Access-Control-Allow-Origin',origin);
    res.header('Access-Control-Allow-Methods','GET');
  }
}

zoneDefinitions.get('/zones', (req,res )=>{
  corsDefinitions(req,res);
  res.json(zoneList);
});
zoneDefinitions.get('/elec', (req,res )=>{
  corsDefinitions(req,res);
  res.json(election);
});
zoneDefinitions.get('/ambit', (req,res )=>{
  corsDefinitions(req,res);
  res.json(ambit);
});

listing.get('/files',async (req,res)=>{
  if(process.env.FTP_PATH){
    corsDefinitions(req,res);
    res.json(await getFileList(process.env.FTP_PATH));
  }
  return {error:'No hay ruta setteada en el sistema.'}
});

listing.get('/not-copy',async (req,res)=>{
  corsDefinitions(req,res);
  res.json(await checkNotCopyFiles());
});

listing.get('/scenery/:zone',async (req,res)=>{
  corsDefinitions(req,res);
  res.json(await filterSchemasFile(req.params.zone));
});

listing.get('/data/:zone',async (req,res)=>{
  corsDefinitions(req,res);
  res.json(await getZoneInfo(req.params.zone));
});

listing.get('/data/:zone/filter/:type',async (req,res)=>{
  corsDefinitions(req,res);
  res.json(await getZoneInfoFilterByType(req.params.zone,req.params.type));
});

results.get('/:elecID/all',async (req,res) => {
  corsDefinitions(req,res);
  const electionType = parseInt(req.params.elecID);
  if(!Number.isNaN(electionType)){
    const response = await getRegisterRedis(req.originalUrl);
    if(response){
      res.json(JSON.parse(response));
    }
    const result = await getResultsSchema(electionType);
    await setRegisterRedis(req.originalUrl,JSON.stringify(result));
    res.json(result);
  }else{
    res.json({error:'El valor de "Tipo de elección" debe ser un Número.'});
  }
});

results.get('/:elecID/filter/:key/:value',async (req,res) => {
  corsDefinitions(req,res);
  const electionType = parseInt(req.params.elecID);
  if(!Number.isNaN(electionType)){
    const response = await getRegisterRedis(req.originalUrl);
    if(response){
      res.json(JSON.parse(response));
    }
    const result = await getResultOneFilter(req.params.key,req.params.value,electionType);
    await setRegisterRedis(req.originalUrl,JSON.stringify(result));
    res.json(result);
  }else{
    res.json({error:'El valor de "Tipo de elección" debe ser un Número.'});
  }
});

results.get('/:elecID/filter/:firstKey/:firstValue/:secondKey/:secondValue',async (req,res) => {
  corsDefinitions(req,res);
  const electionType = parseInt(req.params.elecID);
  if(!Number.isNaN(electionType)){
    const response = await getRegisterRedis(req.originalUrl);
    if(response){
      res.json(JSON.parse(response));
    }
    const result = await getResultTwoFilter(electionType,req.params.firstKey,req.params.firstValue,req.params.secondKey,req.params.secondValue);
    await setRegisterRedis(req.originalUrl,JSON.stringify(result));
    res.json(result);
  }else{
    res.json({error:'El valor de "Tipo de elección" debe ser un Número.'});
  }
});


search.get('/:elecID/by/:complexId',async (req,res) => {
  corsDefinitions(req,res); 
  const electionType = parseInt(req.params.elecID);
  if(!Number.isNaN(electionType)){
    const response = await getRegisterRedis(req.originalUrl);
    if(response){
      res.json(JSON.parse(response));
    }
    const result = await getSearch(req.params.complexId,electionType);
    setRegisterRedis(req.originalUrl,JSON.stringify(result));
    res.json(result);
  }else{
    res.json({error:'El valor de "Tipo de elección" debe ser un Número.'});
  }
});

search.get('/:elecID/by/type/:typeZone',async (req,res) => {
  corsDefinitions(req,res);
  const electionType = parseInt(req.params.elecID);
  if(!Number.isNaN(electionType)){
    const response = await getRegisterRedis(req.originalUrl);
    if(response){
      res.json(JSON.parse(response));
    }
    const result = await getSearchByType(req.params.typeZone,electionType);
    setRegisterRedis(req.originalUrl,JSON.stringify(result));
    res.json(result);
  }else{
    res.json({error:'El valor de "Tipo de elección" debe ser un Número.'});
  }
});

search.get('/:elecID/by/type/:typeZone/:idZone',async (req,res) => {
  corsDefinitions(req,res);
  const electionType = parseInt(req.params.elecID);
  if(!Number.isNaN(electionType)){
    const response = await getRegisterRedis(req.originalUrl);
    if(response){
      res.json(JSON.parse(response));
    }
    const result = await getSearchByTypeAndID(req.params.typeZone,req.params.idZone,electionType);
    setRegisterRedis(req.originalUrl,JSON.stringify(result));
    res.json(result);
  }else{
    res.json({error:'El valor de "Tipo de elección" debe ser un Número.'});
  }
});