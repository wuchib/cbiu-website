import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: import('next').NextConfig = {
  output: "standalone" as const,
};

export default withNextIntl(nextConfig);
