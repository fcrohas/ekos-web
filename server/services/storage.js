import * as fs from 'fs';
import * as Path from 'path';

export class Storage {
    constructor(rootPath) {
        this.rootPath = rootPath;
    }

    getFileAsBuffer(path ) {
        if (fs.existsSync(Path.resolve(this.rootPath, path))) {
            return  new Buffer(fs.readFileSync(Path.resolve(this.rootPath, path), 'binary'), 'binary');
        } else return null;
    }

    getFile(path ) {
        if (fs.existsSync(Path.resolve(this.rootPath, path))) {
            return fs.readFileSync(Path.resolve(this.rootPath, path), 'utf8');
        } else return null;
    }

    putFile(path, content) {
        fs.writeFileSync(Path.resolve(this.rootPath, path), content);
    }

    async getFolderContent(path, isRecursive) {
        return await fs.readdirSync(Path.resolve(this.rootPath, path));
    }
}
