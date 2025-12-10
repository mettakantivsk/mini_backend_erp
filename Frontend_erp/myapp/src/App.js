import {BrowserRouter,Switch , Route , Redirect} from 'react-router-dom';
import LoginPage from './Component/LoginPage';
import Home from './Component/Home';
import RegisterPage from './Component/RegisterPage';
import Project from './Component/Project';
import EditProject from "./Component/EditProject";
import AddOneProject from './Component/AddOneProject';
import ProtectedRoute from './ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/login" component={LoginPage} />
        <Route exact path="/register" component={RegisterPage} />
        <ProtectedRoute exact path="/" component={Home} />
        <ProtectedRoute exact path="/projects/:id" component={Project}/>
        <ProtectedRoute exact path="/projects/edit/:id" component={EditProject} />
        <ProtectedRoute exact path="/addproject" component={AddOneProject} />
        <Redirect to="/login" />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
