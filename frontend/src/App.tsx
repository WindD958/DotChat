import { BrowserRouter, Route, Routes } from "react-router";
import { Toaster } from "sonner";

import SignUpPage from "./pages/SignUpPage";
import SignInPage from "./pages/SignInPage";
import ChatAppPage from "./pages/ChatAppPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
    return (
        <>
            <Toaster richColors />
            <BrowserRouter>
                <Routes>
                    {/* Public routes */}
                    <Route path="/signup" element={<SignUpPage />} />
                    <Route path="/signin" element={<SignInPage />} />

                    {/* Protectect routes */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/" element={<ChatAppPage />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
