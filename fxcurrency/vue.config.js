const { defineConfig } = require("@vue/cli-service");
const AutoImport = require("unplugin-auto-import/webpack");
const Components = require("unplugin-vue-components/webpack");
const { ElementPlusResolver } = require("unplugin-vue-components/resolvers");

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 6060,
    proxy: {
      "/nib": {
        target: process.env.VUE_APP_PROXY,
        changOrigin: true,
        pathRewrite: {
          "/nib": "",
        },
      },
    },
  },
  pluginOptions: {
    i18n: {
      locale: "zh_tw",
      fallbackLocale: "zh_tw",
      localeDir: "locales",
      enableLegacy: false,
      runtimeOnly: false,
      compositionOnly: false,
      fullInstall: true,
    },
  },
  css: {
    extract: {
      ignoreOrder: true,
    },
  },
  configureWebpack: (config) => {
    const plugins = [];
    plugins.push(
      AutoImport({ resolvers: [ElementPlusResolver({ importStyle: false })] })
    );
    plugins.push(Components({ resolvers: [ElementPlusResolver()] }));
    config.plugins = [...config.plugins, ...plugins];

    if (process.env.npm_lifecycle_event === "build") {
      config.devtool = false;
    } else {
      config.devtool = "source-map";
    }
  },
  publicPath: process.env.VUE_APP_PUBLICPATH,
});
