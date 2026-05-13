import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  allowedDevOrigins: ['127.0.0.1', 'localhost', '192.168.0.12'],
  async redirects() {
    return [
      {
        source: '/',
        has: [{ type: 'host', value: 'propflowos.com' }],
        destination: '/propflow-os',
        permanent: false,
      },
      {
        source: '/',
        has: [{ type: 'host', value: 'www.propflowos.com' }],
        destination: '/propflow-os',
        permanent: false,
      },
    ]
  },
}

export default nextConfig