import Head from 'next/head';
import { FC } from 'react';
import { getAbsoluteUrl } from '../utils/env';

interface MetaProps {
  title?: string;
  description?: string;
  keywords?: string[];
  imageUrl?: string;
}

const Meta: FC<MetaProps> = ({ title, description, keywords, imageUrl }) => {
  const siteName = 'Sendullit';
  const actualTitle = title ? title + ' | ' + siteName : siteName;
  const actualDescription = description || 'Schedule Reddit posts';
  const actualKeywords = (keywords || ['reddit', 'post', 'schedule']).join(',');
  const actualImageUrl = imageUrl || '/logo.png';

  return (
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      <title>{actualTitle}</title>
      <link rel="icon" href="/favicon.png" />
      <link rel="manifest" href="/manifest.json" />

      <meta name="application-name" content={siteName} />
      <meta name="description" content={actualDescription} />
      <meta name="keywords" content={actualKeywords} />
      <meta name="theme-color" content="#FF4500" />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={actualTitle} />
      <meta property="og:description" content={actualDescription} />
      <meta property="og:image" content={getAbsoluteUrl(actualImageUrl)} />

      <meta name="twitter:title" content={actualTitle} />
      <meta name="twitter:creator" content="@Tyrrrz" />
      <meta name="twitter:card" content="summary" />
    </Head>
  );
};

export default Meta;
