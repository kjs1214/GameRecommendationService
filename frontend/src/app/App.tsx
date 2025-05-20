import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from '../components/MainPage';
import Profile_Temp from '../components/Profile_Temp';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/profile" element={<Profile_Temp />} />
      </Routes>
    </Router>
  );
}

export default App;
