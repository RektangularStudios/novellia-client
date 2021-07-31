module.exports = {
  pages: {
    index: {
      entry:
        process.env.VUE_APP_MODE === "webapp"
          ? "src/renderer/renderer.ts"
          : "src/main/main.ts",
      template: "src/renderer/index.html"
    }
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: "@import \"@/renderer/colors.scss\";",
      }
    }
  },
  pluginOptions: {
    electronBuilder: {
      mainProcessFile: "src/main/main.ts",
      rendererProcessFile: "src/renderer/renderer.ts"
    }
  },
  productionSourceMap: false,
};
