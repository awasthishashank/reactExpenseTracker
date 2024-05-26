import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AuthContextProvider } from './store/AuthContext';
import AuthForm from './components/Auth/AuthForm';
import Welcome from './components/Welcome';
import CompleteProfile from './components/CompleteProfile';

function App() {
  return (
    <AuthContextProvider>
      <Router>
        <Switch>
          <Route path="/" exact>
            <AuthForm />
          </Route>
          <Route path="/welcome">
            <Welcome />
          </Route>
          <Route path="/complete-profile">
            <CompleteProfile />
          </Route>
        </Switch>
      </Router>
    </AuthContextProvider>
  );
}

export default App;
