import fs from 'fs'
import ini from 'ini'

const source = "config.ini"
const content = fs.readFileSync(source, { encoding: "utf-8" })
const config = ini.parse(content)

class ConfigLoader {
    constructor() {
        if (!ConfigLoader.instance) {
            ConfigLoader.instance = this
        }
        return ConfigLoader.instance
    }

    /**
     * Get the value in config.ini
     * @param {string} section 
     * @param {string} key 
     * @returns {Promise<string>}
     */
    load(section, key) {
        return config[section][key]
    }
}

export const configLoader = new ConfigLoader()
