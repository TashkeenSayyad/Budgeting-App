import fs from 'node:fs';

export class BackupsRepo {
  constructor(private readonly dbPath: string) {}

  exportTo(targetPath: string) {
    fs.copyFileSync(this.dbPath, targetPath);
    return targetPath;
  }

  restoreFrom(sourcePath: string) {
    fs.copyFileSync(sourcePath, this.dbPath);
  }
}
