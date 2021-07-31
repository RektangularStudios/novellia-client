# Novellia dashboard

The single point of access for the Novellia platform.

**Electron build does not work (and hasn't been updated in ages)**

# Installation

The dashboard is built with Electron and Vue.js. It uses electron-builder for deployment.

See this for more information on [Vue CLI Plugin Electron Builder](https://nklayman.github.io/vue-cli-plugin-electron-builder/guide/#installation)

[Install NVM](https://github.com/nvm-sh/nvm#install--update-script)

[Install Node.js through NVM](https://nodejs.org/en/download/package-manager/#nvm)
`nvm install 14.16.0`

Verify the versions. [Notice NPM is installed with Node.js](https://www.npmjs.com/get-npm)
```
node -v
npm -v
```

Install Vue.js CLI
```
npm i -g @vue/cli
npm i -g @vue/cli-init
```

Install dependencies:
`npm install`

on macs you may need to run the following command afterwords : 
node node_modules/electron/install.js

# Running

## Vue CLI

**When running as a web application, Vue does not have access to the file system. It enumerates all data from a backend server accessed through the Novellia SDK.**

`npm run serve`

### Deploying

Execute `npm run build` and copy paste `dist` to a server. Then figure out how to setup Caddy or some other web server.

## Electron

`npm run electron:serve`

The Novellia dashboard should now appear in a window.

Since Electron is a wrapper on Chromium, the full suite of web development tools is available, just hit `ctrl + shift + I`.

# Extras

## Icon builder

Generate icons from a file named `icon.jpg`
`npm run icon`

You can generate the `favicon.ico` by following [this guide](https://graphicdesign.stackexchange.com/questions/77359/how-to-convert-a-square-svg-to-all-size-ico).

```
sudo apt-get install inkscape
sudo apt-get install imagemagick

inkscape -w 16 -h 16 -e 16.png master.svg
inkscape -w 32 -h 32 -e 32.png master.svg
inkscape -w 48 -h 48 -e 48.png master.svg
convert 16.png 32.png 48.png favicon.ico
```

You can also just use an `svg` file as the favicon.
