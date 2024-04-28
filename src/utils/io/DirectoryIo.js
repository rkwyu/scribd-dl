import fs from 'fs'

class DirectoryIo {
    constructor() {
        if (!DirectoryIo.instance) {
            DirectoryIo.instance = this
        }
        return DirectoryIo.instance
    }

    /**
     * Create directories (recursive)
     * @param {string} dest
     *        path of a directory
     */
    async create(dest) {
        fs.mkdirSync(dest, { recursive: true }, (err) => {
            if (err) throw err;
        })
    }

    /**
     * Remove directories (recursive)
     * @param {string} dest 
     */
    async remove(dest) {
        fs.rmSync(dest, { recursive: true }, (err) => {
            if (err) throw err;
        })
    }
}

export const directoryIo = new DirectoryIo()
