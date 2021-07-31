import { app, BrowserWindow, nativeImage } from "electron";
import * as path from "path";

// eslint-disable-next-line
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: any;

export const createDashboardWindow = () => {
  // TODO: figure out why webpack only likes this with an absolute path
  const icon = nativeImage.createFromPath(
    path.join(__static, "icon/novellia/64x64.png")
  );

  const window = new BrowserWindow({
    width: 1280 + 453, // 453 is dev tools width
    height: 720,
    icon: icon,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: (process.env
        .ELECTRON_NODE_INTEGRATION as unknown) as boolean
    }
  });

  // OSX
  if (process.platform === "darwin") {
    app.dock.setIcon(icon);
  }

  window.on("page-title-updated", event => {
    event.preventDefault();
  });
  window.setTitle("Novellia Dashboard");

  window.on("closed", () => {
    app.quit();
  });

  window.removeMenu();

  return window;
};
