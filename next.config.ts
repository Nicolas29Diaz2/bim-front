import createNextIntlPlugin from "next-intl/plugin";
import path from "node:path";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */

const nextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, "src")],
  },
  images: {
    domains: ["picsum.photos", "images.unsplash.com"],
  },
};
export default withNextIntl(nextConfig);
