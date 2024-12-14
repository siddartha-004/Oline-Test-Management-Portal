
import './App.css';
import {useState} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/Home/Home';
import SignIn from './components/SignIn/SignIn';
import AdminDashboard from './components/Admin/AdminDashboard';
import AddTest from './components/Admin/AddTest';
import AssignTestToUser from './components/Admin/AssignTestToUser';
import ModifyTest from './components/Admin/ModifyTest';
import UsersDisplay from './components/Admin/UsersDisplay';
import UserDashboard from './components/User/UserDashboard';
import TestInterface from './components/TestInterface';
import ResultsPage from './components/ResultsPage';
import TestResultList from './components/Admin/TestResultList';
function App() {
  const [username, setUsername] = useState('');
  return (
    <Router>
    <Routes>

      <Route path="/" element={<HomePage />} />
      
   
      <Route path="/signin" element={<SignIn />} />
      
     
      <Route path="/admin" element={<AdminDashboard />}>
        
          <Route path="addtest" element={<AddTest />} />
          <Route path="assigntest" element={<AssignTestToUser />} />
          <Route path="modifytest" element={<ModifyTest/>} />
          <Route path="manageusers" element={<UsersDisplay/>}/>
        <Route path="resultlist" element={<TestResultList/>}/>
        </Route>
        <Route path="/user-dashboard" element={<UserDashboard username={username}/>}/>
        <Route path="/test" element={<TestInterface/>}/>
        <Route path="/result" element={<ResultsPage/>}/>
    </Routes>
  </Router>
  );
}

export default App;
