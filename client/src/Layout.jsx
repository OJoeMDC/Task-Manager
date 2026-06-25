import Navbar from "./Navbar";
import Footer from './Footer';
import { Outlet } from "react-router-dom";

function Layout({ user, setUser }) {
    return(
        <div className="app-layout">

            <main className="page">
                <Outlet />
            </main>

        </div>
    )
}

export default Layout