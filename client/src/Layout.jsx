import Navbar from "./components/Navbar";
import Footer from './components/Footer';
import { Outlet } from "react-router-dom";
import Toast from './components/Toast'

function Layout({ user, setUser, message, toastKey }) {
    /*
    This function describes the basic layout of all pages adding a toast, navbar, and footer
    */
    return(
        <div className="app-layout">
            <Navbar user={user} setUser={setUser} />

            <main className="page">
                <Outlet />
                <Toast message={message} toastKey={toastKey} type="info" />
            </main>

            <Footer />
        </div>
    )
}

export default Layout