/** @type {import('next').NextConfig} */
const nextConfig = {
    rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: `${process.env.API_URL}/api/:path*`
            },
            {
                source: '/api/:path*',
                destination: `${process.env.API_URL}/:path*`
            }
        ];
    }
};

export default nextConfig;
