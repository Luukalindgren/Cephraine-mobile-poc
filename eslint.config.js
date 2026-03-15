// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*"],
  },
  {
    files: ["components/HeadModel3D.tsx"],
    rules: {
      "react/no-unknown-property": ["warn", {
        ignore: [
          "roughness", "metalness", "transparent", "opacity",
          "emissive", "emissiveIntensity", "args", "position",
          "scale", "rotation", "intensity", "object", "attach",
        ],
      }],
    },
  },
]);
