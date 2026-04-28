import nextVitals from "eslint-config-next/core-web-vitals";

const ignores = [
  ".next/**",
  "node_modules/**",
  "next-env.d.ts",
];

const config = [
  { ignores },
  ...nextVitals,
];

export default config;
