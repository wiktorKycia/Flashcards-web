import { Routes, Route } from 'react-router'
import Home from '@/pages/Home'
import UserProfile from '@/pages/UserProfile'
import Quiz from '@/pages/Quiz'
import AuthProvider from '@/context/AuthContext.tsx'
import Register from '@/pages/Register/Register.tsx'
import Login from '@/pages/Login/Login.tsx'
import UserSettings from '@/pages/UserSettings'
import Header from "@/components/Header";
import QuizCreate from '@/pages/QuizCreate'

function App() {
    return (
        <AuthProvider>
            <Header/>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/user/" element={<UserSettings />} />
                <Route path="/user/:id" element={<UserProfile />} />
                <Route path="/quiz/">
                    <Route path="create" element={<QuizCreate/>}/>
                    <Route path=":id" element={<Quiz />} />
                </Route>
                <Route path="/register/" element={<Register />} />
                <Route path="/login/" element={<Login />} />
            </Routes>
        </AuthProvider>
    )
}

export default App
