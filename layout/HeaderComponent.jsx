import Image from "next/image";
import Logo from "../public/images/logo2.png";
import { getSession, signOut, useSession } from "next-auth/react";
import Router from 'next/router'

const NavBar = [
  { name: "Home", url: "/home" },
  { name: "Masters", url: "/universities" },
  { name: "Technologies", url: "/technologies" },
  { name: "Work Space", url: "/jobSites" },
];

const HeaderComponent = () => {
  const { data: session } = useSession();
  
  const handleLogin = () => {
    Router.push('/')
  }

  return (
    <div className="w-full sm:px-6 lg-px-8 bg-cyan-900 top shadow-md">
      <div className="flex justify-between">
        <div className="flex justify-start">
          <Image src={Logo} alt="TechnoUni" height={80} width={150} />
        </div>
        <div className="flex justify-start mt-6 h-2">
          {NavBar.map((navItem) => (
            <a
              className="text-white mr-16 ml-6 hover:text-gray-300 hover:font-bold"
              href={navItem.url}
            >
              {navItem.name}
            </a>
          ))}
        </div>
        {session ? (
          <div className="flex justify-between text-white mr-16 ml-6 hover:text-gray-300 hover:font-bold mt-6">
            <div className="mr-4 font-bold">{session.user.name}</div>
            <div className="cursor-pointer" onClick={signOut}>
              Logout
            </div>
          </div>)
        : (
          <div className="flex justify-between text-white mr-16 ml-6 hover:text-gray-300 hover:font-bold mt-6">
            <div className="cursor-pointer" onClick={handleLogin}>
              Login
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeaderComponent;

export async function getServerSideProps({ req }) {
  const session = await getSession(req);

  if (!session) {
    return {
      redirect: {
        destination: '/'
      },
    };
  }

  return {
    props: { session },
  };
}
