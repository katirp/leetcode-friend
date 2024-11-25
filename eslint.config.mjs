import globals from "globals";
import pluginJs from "@eslint/js";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser, // Include standard browser globals (e.g., window, document)
        chrome: "readonly", // Explicitly define `chrome` as a global
      },
    },
    rules: {
      // Add custom rules here
      "no-undef": "error", // Ensure undefined variables are flagged
      "semi": ["error", "always"], // enforce semicolons
    },
  },
  pluginJs.configs.recommended,
];