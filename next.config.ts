import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: import('next').NextConfig = {
  output: "standalone" as const,
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb'
    }
  }
};

export default withNextIntl(nextConfig);
