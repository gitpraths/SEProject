import type { AppProps } from 'next/app'
import Head from 'next/head'
import '../client/src/index.css'

export default function MyApp({ Component, pageProps }: AppProps) {
  // Add the viewport meta here (Next recommends not placing it in _document).
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}
