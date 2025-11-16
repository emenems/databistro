/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => {
    return [
      {
        source: "/hazard",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://127.0.0.1:8000/hazard/"
            : "/api/hazard/",
      },
      {
         source: "/public-files-sw.js",
         destination:
           process.env.NODE_ENV === "development"
             ? "http://127.0.0.1:8000/public-files-sw.js"
             : "/api/public-files-sw.js",
      },
      {
        source: "/hazard/assets/:path*",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://127.0.0.1:8000/hazard/assets/:path*"
            : "/api/hazard/assets/:path*",
      },
      {
        source: "/hazard/:path*",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://127.0.0.1:8000/hazard/:path*"
            : "/api/hazard/:path*",
      },
      {
        source: "/assets/:path*",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://127.0.0.1:8000/hazard/assets/:path*"
            : "/api/hazard/assets/:path*",
      },
      {
        source: "/api/:path*",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://127.0.0.1:8000/api/:path*"
            : "/api/",
      },
      {
        source: "/docs",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://127.0.0.1:8000/docs"
            : "/api/docs",
      },
      {
        source: "/openapi.json",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://127.0.0.1:8000/openapi.json"
            : "/api/openapi.json",
      },
    ];
  },
};

module.exports = nextConfig;
