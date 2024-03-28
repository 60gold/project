const productPlugins = []; // 專案釋出階段所需要的 babel 外掛

if (process.env.npm_lifecycle_event === "build") {
  productPlugins.push("transform-remove-console");
}

module.exports = {
  presets: ["@vue/cli-plugin-babel/preset"],
  plugins: [...productPlugins],
};
