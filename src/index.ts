import express from "express";
import { configDotenv } from "dotenv";
import { listing, results, search, zoneDefinitions } from "./api/listElements";

const plebiscitoReader = express();
plebiscitoReader.use(express.json());
configDotenv();


const PORT = process.env.PORT ?? '3333';

plebiscitoReader.listen(PORT, () => {
  console.log(`app running on port => ${PORT} 🚀`)
});

plebiscitoReader.use('/api/def/',zoneDefinitions);
plebiscitoReader.use('/api/check/',listing);
plebiscitoReader.use('/api/result/',results);
plebiscitoReader.use('/api/search/',search);
