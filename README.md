# Scribd-dl ![nodedotjs](https://img.shields.io/badge/node.js-v21.6.1-339933.svg?style=flat&logo=nodedotjs&logoColor=white) ![npm](https://img.shields.io/badge/npm-10.2.4-dc2c35.svg?style=flat&logo=npm&logoColor=white)
[![License: GPLv3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

## About ##
Scribd-dl helps downloading documents on [scribd.com](https://www.scribd.com/) without membership / sign-in.  
It takes snapshots of the pages and generate a .pdf file.  

Friendly reminder:  
The .pdf generated is formed by images, so NO text can be copied directly from it.  

## Prerequisites ##
Please make sure the following tool(s) / application(s) are properly setup and ready to use:
- Node.js ([https://nodejs.org/](https://nodejs.org/))

## Setup ##
1. Download repository  
```console
git clone https://github.com/rkwyu/scribd-dl
```
2. Install dependencies
```console
cd ./scribd-dl
npm install
```

## Configuration ##
Output directory can be configured in `config.ini`
```ini
[DIRECTORY]
output=output
```

## Usage (CLI) ##
```console
Usage: node run.js [URL]  
```

#### Example: Download 《The Minds of Billy Milligan》 ####
```console
node run.js https://www.scribd.com/embeds/249398282/content
```

## License ##
[GNU GPL v3.0](LICENSE.md)
