import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Components/Home";
import Main from "./Components/Main";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/main" element={<Main />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
