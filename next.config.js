/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    domains: ["images.unsplash.com"],
  },
  webpack: (config, { isServer }) => {
    // Handle Node.js specific modules in browser
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      child_process: false,
      net: false,
      tls: false,
      "ffmpeg-static": false,
      "fluent-ffmpeg": false,
    };

    // Only mock whatsapp-web.js for client-side
    if (!isServer) {
      config.resolve.alias["whatsapp-web.js"] = require.resolve(
        "./src/lib/whatsapp-mock.js",
      );
    }

    // Mock fluent-ffmpeg to avoid dependency issues
    const mockPath = require.resolve("./src/lib/whatsapp-mock.js");
    config.resolve.alias["fluent-ffmpeg"] = mockPath;

    return config;
  },
};

if (process.env.NEXT_PUBLIC_TEMPO) {
  nextConfig["experimental"] = {
    // NextJS 13.4.8 up to 14.1.3:
    // swcPlugins: [[require.resolve("tempo-devtools/swc/0.86"), {}]],
    // NextJS 14.1.3 to 14.2.11:
    swcPlugins: [[require.resolve("tempo-devtools/swc/0.90"), {}]],

    // NextJS 15+ (Not yet supported, coming soon)
  };
}

module.exports = nextConfig;
