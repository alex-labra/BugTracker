import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./Login";
import Dashboard from "./Dashboard";
import Registration from './Registration';
import Homepage from './Homepage';

function App() {
  return (
      <Router>
        <Routes>
        <Route path="/" element={<Homepage />} />
        <Route  path="/registration" element={<Registration />} />
        <Route  path="/login" element={<Login />} /> 
        <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
  );
}


export default App;
