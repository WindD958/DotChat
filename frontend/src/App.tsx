import { BrowserRouter, Route, Routes } from "react-router";
import SigninPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import ChatAppPage from "./pages/ChatAppPage";
import { Toaster } from "sonner";

function App() {
    return (
        <>
            <Toaster richColors />
            <BrowserRouter>
                <Routes>
                    {/* Public routes */}
                    <Route path="/signin" element={<SigninPage />} />
                    <Route path="/signup" element={<SignUpPage />} />

                    {/* Protectect routes */}
                    <Route path="/" element={<ChatAppPage />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
