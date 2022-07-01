const withPlugins = require("next-compose-plugins");
const withPWA = require("next-pwa");
const withTM = require("next-transpile-modules");
const runtimeCaching = require("next-pwa/cache");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = withPlugins(
  [
    withTM(["sendullit-data"]),

    withPWA,
    {
      pwa: {
        dest: "public",
        disable: process.env.NODE_ENV === "development",
        runtimeCaching,
      },
    },
  ],

  nextConfig
);
