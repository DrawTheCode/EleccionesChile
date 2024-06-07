import { ftpCopyFile, ftpListFiles } from '../models/sftpAccess';
import { configDotenv } from 'dotenv';
import decompress from 'decompress';
import fs, { writeFile } from 'fs-extra';

import {
  makeFolderIfNotExist,
  makeFileShcema,
  dataDisplay,
  makeFileInputCamelCase,
  makeFileResultShcema,
} from '../utils/genericFunctions';
import { fileResultsShcemas, fileShcemas } from '../types/settings';

configDotenv();

const localPath = dataDisplay();

export const getFileList = async (path: string): Promise<string[] | null> => {
  const result = await ftpListFiles(path);
  let tempResult: string[] = [];
  if (await result) {
    const currentValue = result.filter(filterAckCache);
    currentValue.forEach((element: any) => {
      tempResult.push(element.name);
    });
    return tempResult;
  }
  return null;
};

export async function copyFilesLocal(
  rootPath: string | false = false,
): Promise<string> {
  if (process.env.FTP_PATH && localPath) {
    const tempPath = rootPath ? rootPath : '';
    makeFolderIfNotExist(tempPath);
    const listFilesToCopy = await checkNotCopyFiles();
    if (listFilesToCopy && listFilesToCopy.length > 0) {
      let tempConsole = '';
      listFilesToCopy.forEach(item => {
        if (
          item.match(/(VOTACION|(V|v)otacion|ESCENARIO|(E|e)scenario)_/) !==
          null
        ) {
          ftpCopyFile(process.env.FTP_PATH + item, tempPath + item);
          tempConsole +=
            'Se a copiado el archivo en ==> ' + tempPath + item + '\n';
        }
      });
      return tempConsole;
    }
    return 'No hay archivos que copiar. \n';
  }
  return 'No esta configurado FTP_PATH o localPath. \n';
}

export async function decompressFiles(
  rootPath: string | false = false,
): Promise<string> {
  if (localPath) {
    const tempPath = rootPath ? rootPath : '';
    const unzipPath = `${tempPath}unzip`;
    makeFolderIfNotExist(unzipPath);
    let localData = await readLocalData(tempPath);
    if (localData.length > 0) {
      const onlyZipList = localData.filter(zipFileName => {
        return zipFileName.match(/\.(zip|ZIP)$/) !== null;
      });
      let tempConsole = '';
      onlyZipList.forEach(zip => {
        const unzipPathAndName = unzipPath + '/' + zip;
        const file = unzipPathAndName.substring(0, unzipPathAndName.length - 4);
        if (
          !fs.existsSync(file) &&
          !fs.existsSync(unzipPathAndName + '.error')
        ) {
          decompress(`${tempPath}${zip}`, unzipPath)
            .then(_files => {
              tempConsole += `Archivo descomprimido con exito => ${unzipPathAndName} \n`;
            })
            .catch(error => {
              tempConsole += `\n ============ \n ERROR DE ZIPPEADO=> ${JSON.stringify(
                error,
              )} \n ============ \n`;
              writeFile(`${unzipPathAndName}.error`, JSON.stringify(error));
            });
        }
      });
      console.log(tempConsole);
      return tempConsole;
    }
    return `No hay para descomprimir en: ${unzipPath} \n`;
  }
  return 'No esta definido el localPATH \n';
}

export const checkNotCopyFiles = async (): Promise<string[] | null> => {
  if (process.env.FTP_PATH && localPath) {
    makeFolderIfNotExist(localPath);
    const localData = await readLocalData(localPath);
    const servelData = await getFileList(process.env.FTP_PATH);
    if (servelData !== null) {
      const difference = servelData.filter(x => !localData.includes(x));
      return difference;
    }
  }
  return null;
};

async function readLocalData(directory: string): Promise<string[]> {
  const localResult: string[] = [];
  (await fs.readdir(directory)).forEach(item => {
    if (typeof item === 'string' && item !== '.gitkeep') {
      localResult.push(item);
    }
  });
  return localResult;
}

export async function filterSchemasFile(
  filter: string,
): Promise<fileShcemas[]> {
  let results: fileShcemas[] = [];
  filter = makeFileInputCamelCase(filter);
  if (localPath) {
    const regularExp = new RegExp(
      `Escenario_${filter}_[0-9][0-9][0-9][0-9][0-9][0-9]?.(txt|TXT)$`,
    );
    const localData = await readLocalData(localPath);
    const validateNames = localData.filter(item => {
      return item.match(regularExp) !== null;
    });
    if (validateNames.length > 0) {
      validateNames.forEach(item => {
        const tempResult = makeFileShcema(item, filter);
        if (tempResult) {
          results.push(tempResult);
        }
      });
      if (results.length > 1) {
        results = results.sort((a, b) => b.id - a.id);
      }
    }
  }
  return results;
}

export async function filterResultsFile(
  elecID: number,
): Promise<fileResultsShcemas[]> {
  let results: fileResultsShcemas[] = [];
  if (localPath) {
    const regularExp = new RegExp(
      `VOTACION_${elecID}_[0-9][0-9][0-9][0-9][0-9][0-9]?_[0-9]{4}.(txt|TXT)$`,
    );
    const localData = await readLocalData(`${localPath}unzip/`);
    const validateNames = localData.filter(item => {
      return item.match(regularExp) !== null;
    });
    if (validateNames.length > 0) {
      validateNames.forEach(item => {
        const tempResult = makeFileResultShcema(item, elecID);
        if (tempResult) {
          results.push(tempResult);
        }
      });
      if (results.length > 1) {
        results = results.sort((a, b) => b.id - a.id);
      }
    }
  }
  return results;
}

function filterAckCache(item: any) {
  return (
    'name' in item &&
    typeof item.name === 'string' &&
    item.name.match(/.(ack|cache)$/) === null
  );
}
