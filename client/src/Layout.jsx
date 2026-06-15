import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

function Layout() {
    return(
        <div className="app-layout">
            <Navbar />

            <main className="page">
                <Outlet />
            </main>
        </div>
    )
}

export default Layout