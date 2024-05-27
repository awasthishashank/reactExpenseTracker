import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Header from "./components/Header/Header";
import { AuthContextProvider } from "./store/AuthContext";
import AuthForm from './components/Auth/AuthForm'
import welcome from './components/Welcome'

const App = () => {
  return (
    <AuthContextProvider>
      <Router>
        <Header />
        <Switch>
          {/* Define your routes here
          <Route path="/store" component={Store} />
          <Route path="/about" component={About} />
          <Route path="/contact" component={ContactUs} /> */}
          <Route path="/" component={AuthForm} exact />
          <Route path="/welcome" component={welcome} exact />
        </Switch>
      </Router>
    </AuthContextProvider>
  );
};

export default App;
