import { useState } from "react";
import { auth, provider } from "../firebase";
import "animate.css";
import {
    getAuth,
    signInWithPopup,
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
} from "firebase/auth";
import { toast } from "react-toastify";

function Login({ onToggle }) {
    const handleLoginClick = () => {
        onToggle();
    };

    // REGISTER WITH EMAIL AND PASSWORD
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");

    const handleRegister = () => {
        const auth = getAuth();
        if (email === "" || password === "" || password2 === "") {
            toast.error("Pola formularza nie mogą być puste!");
            return;
        } else if (password === password2) {
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    toast.error(errorMessage);
                });
        } else {
            toast.error("Hasła nie są takie same!");
        }
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
        <div className="form animate__animated animate__shakeX">
            <img
                src="./avatar-man-register.png"
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
                <div className="input-group mb-3">
                    <span className="input-group-text input-width">
                        Potwierdź
                    </span>
                    <input
                        type="password"
                        className="form-control"
                        placeholder="**********"
                        value={password2}
                        onChange={(e) => setPassword2(e.target.value)}
                    ></input>
                </div>
                <div className="dfex">
                    <button
                        className="btn btn-primary orang"
                        type="button"
                        onClick={handleRegister}
                    >
                        Zarejestruj się!
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
            <p className="mt-4 nowe" onClick={handleLoginClick}>
                Masz już konto? Zaloguj się!
            </p>
        </div>
    );
}
export default Login;
