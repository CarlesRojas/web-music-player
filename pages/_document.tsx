import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en" id="htmlRoot">
      <Head>
        <meta name="application-name" content="Spot" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Spot" />
        <meta name="description" content="website for the first mundimoto hackathon" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#000000" />

        <link rel="apple-touch-icon" href="/appleIcon120.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/appleIcon180.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/appleIcon152.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/appleIcon167.png" />

        <link rel="manifest" href="/manifest.json" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
