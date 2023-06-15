import { useState } from "react";
import { auth, provider } from "../firebase";
import "animate.css";
import {
    getAuth,
    signInWithPopup,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
} from "firebase/auth";
import { toast } from "react-toastify";

function Login({ onToggle }) {
    const handleRegisterClick = () => {
        onToggle();
    };

    // LOGIN WITH EMAIL AND PASSWORD
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = () => {
        const auth = getAuth();
        if (email === "" || password === "") {
            toast.error("Pola formularza nie mogą być puste!");
            return;
        }
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                toast.error(errorMessage);
            });
    };

    // LOGIN WITH GOOGLE
    const handleGoogleLogin = () => {
        const auth = getAuth();
        signInWithPopup(auth, provider)
            .then((result) => {
                const credential =
                    GoogleAuthProvider.credentialFromResult(result);
                const user = result.user;
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                const email = error.customData.email;
                const credential =
                    GoogleAuthProvider.credentialFromError(error);
                console.log(errorCode, errorMessage, email, credential);
            });
    };

    return (
        <div className="form animate__animated animate__backInDown">
            <img
                src="./avatar-man.png"
                alt="Awatar"
                className="avatar mt-4 mb-4"
            />
            <form>
                <div className="input-group mb-3">
                    <span className="input-group-text input-width">Email</span>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="kowalskij@gmail.com"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                    ></input>
                </div>
                <div className="input-group mb-3">
                    <span className="input-group-text input-width">Hasło</span>
                    <input
                        type="password"
                        className="form-control"
                        placeholder="**********"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    ></input>
                </div>
                <div className="dfex">
                    <button
                        className="btn btn-primary orang"
                        type="button"
                        onClick={handleLogin}
                    >
                        Zaloguj się!
                    </button>
                </div>
                <div className="loginGoogle text-center">
                    <img
                        src="loginbygoogle.png"
                        alt="Login By Google"
                        className="GoogleIcon mt-3"
                        onClick={handleGoogleLogin}
                    />
                </div>
            </form>
            <p className="mt-4 nowe" onClick={handleRegisterClick}>
                Nie masz konta? Stwórz je klikając tutaj!
            </p>
        </div>
    );
}
export default Login;
