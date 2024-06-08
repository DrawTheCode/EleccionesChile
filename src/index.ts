import express from 'express';
import compression from 'compression';
import { configDotenv } from 'dotenv';
import { listing, results, search, zoneDefinitions } from './api/listElements';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger_output.json';
import path from 'path';

const electionReader = express();
electionReader.use(express.json());
electionReader.use(compression());
configDotenv();

const PORT = process.env.PORT ?? '3333';

electionReader.use(
  '/api/public',
  express.static(path.join(__dirname, 'public')),
);

electionReader.listen(PORT, () => {
  console.log(`app running on port => ${PORT} 🐳`);
});

electionReader.use('/api/def/', zoneDefinitions);
electionReader.use('/api/check/', listing);
electionReader.use('/api/result/', results);
electionReader.use('/api/search/', search);

electionReader.use(
  '/api/docs/',
  swaggerUi.serveFiles(swaggerDocument),

  swaggerUi.setup(swaggerDocument, {
    swaggerOptions: {
      url: '/api/docs/swagger.json',
    },
  }),
);
