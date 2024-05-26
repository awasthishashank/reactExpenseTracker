import { Switch, Route, Redirect } from 'react-router-dom';
import { AuthContextProvider } from './store/AuthContext';
import AuthForm from './components/Auth/AuthForm';
import Welcome from './components/Welcome';

function App() {
  return (
    <AuthContextProvider>
      <Switch>
        <Route path="/" exact>
          <AuthForm />
        </Route>
        <Redirect to="/" />
      </Switch>
    </AuthContextProvider>
  );
}

export default App;

