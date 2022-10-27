import Head from "next/head";
import Image from "next/image";
import { getSession, useSession, signIn } from "next-auth/react";
import classNames from "classnames";
import { Button } from "@chakra-ui/react";
import Layout from "../layout/Layout";
import page1 from "../public/images/page1.png";
import github from "../public/images/github.png";
import google from "../public/images/google.png"

export default function Home() {
  const { data: session } = useSession();
  const buttonWrapperClass = classNames("w-full py-3 flex justify-center gap-2 hover:bg-cyan-900 hover:text-gray-100 hover:border-white border-2 border-cyan-900 rounded")

  const handleGithubSignIn = () => {
    signIn('github', {callbackUrl: '/home'})
  }

  const handleGoogleSignIn = () => {
    signIn('google', {callbackUrl: '/home'})
  }

  return (
    <Layout>
      <Head>
        <title>Login</title>
      </Head>
      <div className="flex h-screen bg-white">
        <div className="m-auto rounded-md w-3/5 h-3/4 grid bg-slate-300 lg:grid-cols-2">
         <div className="text-center py-10">
         <section className="w-3/4 mx-auto flex flex-col gap-10">
            <div>
              <h1 className="text-gray-800 text-4xl font-bold py-4">
                Explore TechnoUni
              </h1>
            </div>
            <div>
            <p>To get more informative details, login to the application!</p>
            </div>
            <div>
              <Button className={buttonWrapperClass} onClick={handleGithubSignIn}>Sign In with Github <Image src={github} height={30} width={30}/></Button>
            </div>
            <div>
              <Button className={buttonWrapperClass} onClick={handleGoogleSignIn}>Sign In with Google <Image src={google} height={30} width={30}/></Button>
            </div>
          </section>
         </div>
          <div className="right flex flex-col justify-evenly bg-cyan-600">
            <Image src={page1} alt="TechnoUni"></Image>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ req }) {
  const session = await getSession(req);

  if (session) {
    return {
      redirect: {
        destination: '/home',
        permanent: false,
      },
    };
  }

  return {
    props: {}
  }
}