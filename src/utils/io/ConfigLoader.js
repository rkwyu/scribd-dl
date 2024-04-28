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
        if (Object.keys(config[section]).includes(key)) {
            return config[section][key]
        } else {
            throw new TypeError(`Unknown key: ${key}`)
        }
    }
}

export const configLoader = new ConfigLoader()
