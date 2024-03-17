import LoginUser from './user/LoginUser';
import RegisterUser from './user/RegisterUser';
import Friends from './friends/Friends';
import {BrowserRouter,Routes,Route} from 'react-router-dom';
function App() {
  return (

    <div className="App">
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginUser/>} />
        <Route path="/register" element={<RegisterUser/>} />
        <Route path="/friends" element={<Friends/>} />
      </Routes>
    </BrowserRouter>

    </div>
  );
}

export default App;
