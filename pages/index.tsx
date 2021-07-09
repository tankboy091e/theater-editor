import Footer from 'components/footer'
import Layout from 'layouts/default'
import Landing from 'templates/landing'

export default function Page() {
  return (
    <Layout
      footer={<Footer />}
    >
      <Landing />
    </Layout>
  )
}
