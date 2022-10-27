import Head from "next/head";
import Layout from "../layout/Layout"

const Home = () => {
 return(
    <Layout>
    <Head>
      <title>Home Page</title>
    </Head>
    <div className="flex h-screen bg-white">
     Home Page
    </div>
  </Layout>
 )
}

export default Home