import { Helmet } from 'react-helmet-async';

import type { HelmetProps } from 'react-helmet-async';

import { isClient, PUBLIC_URL } from '@/configs';

interface HeadProps extends HelmetProps {
  title?: string;
  description?: string;
}

const ogImage = '/public/logo.png';
const hostname = isClient ? PUBLIC_URL : '';

export const Head = ({ title = '', description = '', ...props }: HeadProps) => (
  <Helmet
    title={title ? `${title} - Head & Shoulder` : undefined}
    defaultTitle="Head & Shoulder"
    {...props}
  >
    <meta name="description" content={description} />
    <meta name="author" content="Designed and Developed by Head & Shoulder team" />
    <meta property="og:url" content={hostname} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content="Designed and Developed by Head & Shoulder team" />
    <meta name="twitter:card" content={ogImage} />
    <meta name="twitter:image" content={ogImage} />
    <meta property="og:image" content={ogImage} />
  </Helmet>
);
