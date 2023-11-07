import Head from 'next/head'

export const Title = (title?: string) => {
  const fullTitle = `${title}ENS`
  return (
    <Head>
      <title>{fullTitle}</title>
    </Head>
  )
}
