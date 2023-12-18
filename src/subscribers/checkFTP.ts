import { copyFilesLocal, decompressFiles } from "./checkSchemas";

module.exports.check = function() {
  copyFilesLocal();
  decompressFiles();
  const now = new Date().toLocaleString();
  console.log(`Última revisión de FTP => ⏱️ ${now}`);
};