import Home from './pages/Home'
import UserProfile from './pages/UserProfile'
import { Routes, Route } from 'react-router'
import Quiz from "./pages/Quiz";

function App() {
    return (
        <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/profile/' element={<UserProfile/>}/>
            <Route path='/quiz/' element={<Quiz quizName={"test"}/>}/>
        </Routes>
    )
}

export default App
