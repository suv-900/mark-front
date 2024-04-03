import LoginUser from './user/LoginPage';
import RegisterUser from './user/RegisterUser';
import Friends from './friends/Friends';
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import {ChatPage} from './chat/ChatPage';

function App() {
  return (

    <div id="app">
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginUser/>} />
        <Route path="/register" element={<RegisterUser/>} />
        <Route path="/friends" element={<Friends/>} />
        <Route path="/chat" element={<ChatPage/>} />
      </Routes>
    </BrowserRouter>

    </div>
  );
}

export default App;
