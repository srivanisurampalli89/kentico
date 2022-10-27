const Footer = () => {
    const getYear = () => {
        const date = new Date();
        const year = date.getFullYear();
        return year;
    }

    return (
        <footer className="w-full bottom-0 bg-cyan-900 h-11 flex justify-center fixed shadow-lg">
            <div className="text-white mt-2">
            © {getYear()} TechnoUni. All Rights Reserved.
            </div>
        </footer>
    )
}

export default Footer;
