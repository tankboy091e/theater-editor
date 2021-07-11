import { AppProps } from 'next/app'
import Head from 'next/head'
import ModalProvider from 'providers/modal'
import IntegratedDialogProvider from 'providers/dialog/integrated'
import 'sass/global.scss'
import KeyboardProvider from 'providers/keyboard'

const DEFAULT_TITLE = 'Theater Editor'
const DEFAULT_DESCRIPTION = 'description'

export default function App({ Component, pageProps, router }: AppProps) {
  const { titleHead, descriptionHead, typeHead } = pageProps
  const title = titleHead ? `${titleHead} - ${DEFAULT_TITLE}` : DEFAULT_TITLE
  const description = descriptionHead || DEFAULT_DESCRIPTION
  const type = typeHead || 'website'
  return (
    <>
      <Head>
        <title>{DEFAULT_TITLE}</title>
        <link rel="canonical" href={`${process.env.ORIGIN}${router.asPath}`} />
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:url" content="https://ohjinsu.me" />
        <meta property="og:site_name" content={DEFAULT_TITLE} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content={type} />
        <meta property="og:image" content="https://www.ohjinsu.me/preview.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <ModalProvider>
        <IntegratedDialogProvider>
          <KeyboardProvider>
            <Component {...pageProps} />
          </KeyboardProvider>
        </IntegratedDialogProvider>
      </ModalProvider>
    </>
  )
}
