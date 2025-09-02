import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Point output file tracing to the project root to avoid incorrect root inference
  outputFileTracingRoot: path.join(__dirname, ".."),
};

export default nextConfig;
