import Header from "./HeaderComponent";
import Footer from "./FooterComponent";


const Layout = (props) => {
    return(
        <div>
            <Header />
            <div>{props.children}</div>
            <Footer />
        </div>  
    )
}

export default Layout;
