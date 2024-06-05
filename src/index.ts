import express from "express";
import compression from "compression";
import { configDotenv } from "dotenv";
import { listing, results, search, zoneDefinitions } from "./api/listElements";

const electionReader = express();
electionReader.use(express.json());
electionReader.use(compression());
configDotenv();


const PORT = process.env.PORT ?? '3333';

electionReader.listen(PORT, () => {
  console.log(`app running on port => ${PORT} 🐳`)
});

electionReader.use('/api/def/',zoneDefinitions);
electionReader.use('/api/check/',listing);
electionReader.use('/api/result/',results);
electionReader.use('/api/search/',search);
