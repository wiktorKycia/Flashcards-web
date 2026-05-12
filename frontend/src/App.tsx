import Home from './pages/Home'
import UserProfile from './pages/UserProfile'
import { Routes, Route } from 'react-router'
import Quiz from './pages/Quiz'
import AuthProvider from '@/context/AuthContext.tsx'
import Register from '@/pages/Register/Register.tsx'
import Login from '@/pages/Login/Login.tsx'
import UserSettings from '@/pages/UserSettings'
import MatchChallenge from '@/pages/MatchChallenge'
import KnowledgeTest from '@/pages/KnowledgeTest'

function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/user/" element={<UserSettings />} />
                <Route path="/user/:id" element={<UserProfile />} />
                <Route path="/quiz/">
                    <Route path=":id" element={<Quiz />} />
                    <Route path=":id/match-challenge" element={<MatchChallenge />} />
                    <Route path=":id/test" element={<KnowledgeTest />} />
                </Route>
                <Route path="/register/" element={<Register />} />
                <Route path="/login/" element={<Login />} />
            </Routes>
        </AuthProvider>
    )
}

export default App
