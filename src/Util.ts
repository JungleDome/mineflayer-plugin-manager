import { resolve } from 'path'
import { promises as fs } from 'fs'

export class Util {
    /**
     * Emits the debug log event with the specified message.
     * @private
     */
    static debug(logDebug: boolean, msg: string): void {
        if (!logDebug)
            return
        console.log(msg)
    }

    /**
     * Recursively get all filepath in a directory
     * @private
     */
    static async getFiles(dir: string): Promise<string[]> {
        const dirents = await fs.readdir(dir, { withFileTypes: true });
        const files = await Promise.all(dirents.map((dirent) => {
            const res = resolve(dir, dirent.name);
            return dirent.isDirectory() ? this.getFiles(res) : res;
        }));
        return Array.prototype.concat(...files);
    }
}