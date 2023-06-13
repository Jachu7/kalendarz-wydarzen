import "./Home.css";
import { useEffect, useState } from "react";
import { auth, provider } from "../firebase";
import { useNavigate } from "react-router-dom";
import "animate.css";
import WebFont from "webfontloader";
import Login from "./Login";
import Register from "./Register";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function Home() {
    // IF USER IS LOGGED IN
    const navigate = useNavigate();
    auth.onAuthStateChanged((user) => {
        if (user) {
            console.log(user.email);
            navigate("/main");
        }
    });

    useEffect(() => {
        WebFont.load({
            google: {
                families: ["Montserrat"],
            },
        });
    }, []);

    const [showLogin, setShowLogin] = useState(true);
    const handleToggle = () => {
        setShowLogin(!showLogin);
    };

    // Toastify
    const notify = () => toast("Wow so easy!");

    return (
        <main>
            <aside>
                <h1 className="mt-4 text-center">kalendarz-wydarzeń.web.app</h1>
                <p>Twój terminarz, dzienniczek i kalendarz w jednym miejscu!</p>
            </aside>
            <div className="main">
                <ToastContainer />
                {showLogin ? (
                    <Login onToggle={handleToggle} />
                ) : (
                    <Register onToggle={handleToggle} />
                )}
            </div>
        </main>
    );
}

export default Home;
