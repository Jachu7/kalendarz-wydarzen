import "./Home.css";
import { useState } from "react";

function Home() {
    return (
        <main>
            <div className="form">
                <img
                    src="./avatar-man.png"
                    alt="Awatar"
                    className="avatar mt-4 mb-4"
                />
                <form>
                    <div className="input-group mb-3">
                        <span className="input-group-text input-width">
                            Email
                        </span>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="bob@gmail.com"
                        ></input>
                    </div>
                    <div className="input-group mb-3">
                        <span className="input-group-text input-width">
                            Password
                        </span>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="**********"
                        ></input>
                    </div>
                    <div className="dfex">
                        <button className="btn btn-primary orang" type="button">
                            Zaloguj się!
                        </button>
                    </div>
                    <div className="loginGoogle text-center ">
                        <img
                            src="loginbygoogle.png"
                            alt="Login By Google"
                            className="GoogleIcon mt-3"
                        />
                    </div>
                </form>
            </div>
        </main>
    );
}

export default Home;
