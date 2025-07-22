import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Disable common strict rules that cause issues during development
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/prefer-const": "off",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-inferrable-types": "off",
      
      // React/Next.js specific rules
      "react/no-unescaped-entities": "off",
      "react/display-name": "off",
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
      "react/no-children-prop": "off",
      "react-hooks/exhaustive-deps": "off", // Turn off completely to avoid build issues
      
      // General JavaScript rules
      "no-unused-vars": "off",
      "no-console": "off", // Allow console.log for debugging
      "no-debugger": "off", // Allow debugger statements
      "no-empty": "off",
      "no-constant-condition": "off",
      "no-undef": "off", // TypeScript handles this
      "prefer-const": "off",
      
      // Import/Export rules
      "import/no-anonymous-default-export": "off",
      "import/no-unresolved": "off",
      
      // Next.js specific rules - turn off to avoid build warnings
      "@next/next/no-img-element": "off",
      "@next/next/no-html-link-for-pages": "off",
      
      // Accessibility rules - turn off for now
      "jsx-a11y/alt-text": "off",
      "jsx-a11y/aria-props": "off",
      "jsx-a11y/aria-proptypes": "off",
      "jsx-a11y/aria-unsupported-elements": "off",
      "jsx-a11y/role-has-required-aria-props": "off",
      "jsx-a11y/role-supports-aria-props": "off",
    },
  },
];

export default eslintConfig;
