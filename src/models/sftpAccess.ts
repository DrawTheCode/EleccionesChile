import { configDotenv } from "dotenv";
import sftp, { ConnectOptions }  from "ssh2-sftp-client";


configDotenv();

const makeAConfig = (): ConnectOptions | null => {
  if(process.env.FTP_HOST && process.env.FTP_USER &&  process.env.FTP_PASS){
    return {
      host: process.env.FTP_HOST,
      port: 22,
      username: process.env.FTP_USER,
      password: process.env.FTP_PASS
    };
  }
  return null;
}

const config = makeAConfig();


export const validateExistsFile = async (path:string) =>{
  let tempResul: any | null = null;
  let tempClient = new sftp();
  if(config){
    await tempClient.connect(config)
      .then(() => {
        return tempClient.exists(path);
      })
      .then((data: any) => {
        tempResul = data;
      })
      .then(() => {
        tempClient.end();
      })
      .catch((err: { message: any; }) => {
        console.error(err.message);
      });
  }
  return tempResul;
}

export async function ftpCopyFile(originPath:string,destinyPath:string){
  let tempResul: any | null = null;
  if(config){
    let tempClient = new sftp();
    await tempClient.connect(config)
      .then(() => {
        return tempClient.fastGet(originPath,destinyPath);
      })
      .then((data: any) => {
        tempResul = data;
      })
      .then(() => {
        tempClient.end();
      })
      .catch((err: { message: any; }) => {
        console.error(err.message);
      });
  }
  return tempResul;
}

export async function ftpListFiles(originPath:string){
  let tempResul: any | null = null;
  if(config){
    let tempClient = new sftp();
    await tempClient.connect(config)
      .then(() => {
        return tempClient.list(originPath);
      })
      .then((data: any) => {
        tempResul = data;
      })
      .then(() => {
        tempClient.end();
      })
      .catch((err: { message: any; }) => {
        console.error(err.message);
      });
  }
  return tempResul;
}