import { copyFilesLocal, decompressFiles } from "./checkSchemas";

const args = process.argv.slice(2).length>0?process.argv.slice(2)[0]:false;

export default function check(dockerPath:string|false=false) {
  copyFilesLocal(dockerPath);
  decompressFiles(dockerPath);
  const now = new Date().toLocaleString();
  console.log(`Última revisión de FTP => ⏱️ ${now}`);
};

check(args);