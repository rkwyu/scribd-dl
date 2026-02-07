# Scribd-dl ![nodedotjs](https://img.shields.io/badge/node.js-v21.6-339933.svg?style=flat&logo=nodedotjs&logoColor=white) ![npm](https://img.shields.io/badge/npm-10.2-dc2c35.svg?style=flat&logo=npm&logoColor=white)  ![Regression Tests](https://github.com/rkwyu/scribd-dl/actions/workflows/test.yml/badge.svg) 

<a href="https://buymeacoffee.com/r1y5i" target="_blank">
<img style="border-radius: 20px" src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" height="41" width="174">
</a>

---

A command-line tool for downloading document content where you are authorized to do so.

(This project is not intended to bypass paywalls, violate terms of service, or download copyrighted content you are not permitted to access.)

## ⚠️ Important Legal & Ethical Notice ##
This tool is provided for use only on documents that you have legal permission to download, for example:

- Documents you have uploaded yourself
- Public-domain documents
- Works you have licensed
- Scribd content you have access to under your account *where offline saving is explicitly permitted*

Downloading or redistributing copyrighted material you don’t own or have a license for may violate copyright law and Scribd’s Terms of Service. Use responsibly.

(You should consult legal advice if unsure about rights.)

## About ##

Scribd-dl is a utility that helps generate local copies of content for personal use where permitted from supported platforms if and only if you have the right to do so. It works by rendering pages and saving them in a format you can view offline.

Currently supported sources:
- [scribd.com](https://www.scribd.com/)
- [slideshare.net](https://www.slideshare.net/)
- [everand.com](https://www.everand.com/podcasts) podcast audio pages

for documents you are authorized to view and save

This tool does not remove paywalls, circumvent protections, or provide unauthorized access.

## Prerequisites ##

Install [Node.js](https://nodejs.org/en/download/) (recommended: latest LTS) to run this tool.

> Please install Node.js using pre-built installers for your platform. You may encounter incompatibility issues with different development tools otherwise. 

Confirm installation:
```console
node -v
npm -v
```
The commands should print the versions of Node.js and npm accordingly.  

## Setup ##

Clone the repository and install dependencies:
```console
git clone https://github.com/rkwyu/scribd-dl
cd scribd-dl
npm install
```

## Configuration ##

Edit `config.ini` to change rendering time or output details:
```ini
[SCRIBD]
rendertime=100

[DIRECTORY]
output=output
filename=title
```

| Config | Description | Support |
| --- | --- | --- |
| `rendertime` | Wait time (ms) for page rendering | [scribd.com](https://www.scribd.com/) |
| `output` | Output folder | [scribd.com](https://www.scribd.com/)<br/>[slideshare.net](https://www.slideshare.net/)<br/>[everand.com](https://www.everand.com/podcasts) |
| `filename` | Output filename<br/>`title`: filename = default filename / title<br/>(otherwise, filename = ID) | [scribd.com](https://www.scribd.com/)<br/>[slideshare.net](https://www.slideshare.net/) |

## Usage (CLI) ##

```console
Usage: npm start [options] <url>
```

Example:
Download a document you have access to:
```console
npm start "https://www.scribd.com/doc/123456789/Example-Document"
```

Ensure you have the legal right and platform permission to download the referenced content before using this command.


## Support URL Format ##
- https://www.scribd.com/doc/**
- https://www.scribd.com/embeds/**
- https://www.slideshare.net/**
- https://www.slideshare.net/slideshow/**
- https://www.everand.com/podcast-show/**
- https://www.everand.com/podcast/**
- https://www.everand.com/listen/podcast/**

## Why This Matters ##

Tools that automate downloading from websites can be misused to access content without proper authorization. This README clarifies that you should only use scribd-dl where you are permitted by law and by the site’s terms of service. It’s your responsibility to comply with those terms.

## Disclaimer

This project is not affiliated with, endorsed by, or sponsored by Scribd, SlideShare, or Everand.

All trademarks and copyrights belong to their respective owners.

Users are solely responsible for ensuring their use of this tool complies with applicable laws and platform terms.

## License ##
This project is licensed under the [MIT License](LICENSE.md)