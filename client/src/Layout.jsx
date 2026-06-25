import Navbar from "./Navbar";
import Footer from './Footer';
import { Outlet } from "react-router-dom";

function Layout({ user, setUser }) {
    return(
        <div className="app-layout">
            <Navbar user={user} setUser={setUser} />

            <main className="page">
                <Outlet />
            </main>

            <Footer />
        </div>
    )
}

export default Layout