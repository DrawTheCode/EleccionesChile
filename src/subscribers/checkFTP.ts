import { copyFilesLocal, decompressFiles } from "./checkSchemas";

module.exports.check = function(dockerPath:string|false=false) {
  copyFilesLocal(dockerPath);
  decompressFiles(dockerPath);
  const now = new Date().toLocaleString();
  console.log(`Última revisión de FTP => ⏱️ ${now}`);
};