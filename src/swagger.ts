const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger_output.json';
const endpointsFiles = ['./api/listElements.ts'];

swaggerAutogen(outputFile, endpointsFiles);
