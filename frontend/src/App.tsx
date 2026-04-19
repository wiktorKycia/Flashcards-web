import Home from './pages/Home'
import UserProfile from './pages/UserProfile'
import { Routes, Route } from 'react-router'
import Quiz from "./pages/Quiz";
import { AuthProvider } from '@/context/AuthContext.tsx'
import Register from '@/pages/Register/Register.tsx'
import Login from '@/pages/Login/Login.tsx'

function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path='/' element={<Home/>}/>
                <Route path='/profile/' element={<UserProfile/>}/>
                <Route path='/quiz/' element={<Quiz quizName={"test"}/>}/>
                <Route path='/register/' element={<Register/>}/>
                <Route path='/login/' element={<Login/>}/>
            </Routes>
        </AuthProvider>

    )
}

export default App
