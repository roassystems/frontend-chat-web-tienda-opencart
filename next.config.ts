import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: ["www.tiendapadelpoint.com"], // <-- agrega aquí tu dominio
  },
};

export default nextConfig;
