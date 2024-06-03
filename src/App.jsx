import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Header from "./components/Header/Header";
import AuthForm from './components/Auth/AuthForm'
import welcome from './components/Welcome'
import CompleteProfile from "./components/CompleteProfile";

const App = () => {
  return (
      <Router>
        <Header />
        <Switch>
          {/* Define your routes here
          <Route path="/store" component={Store} />
          <Route path="/about" component={About} />
          <Route path="/contact" component={ContactUs} /> */}
          <Route path="/" component={AuthForm} exact />
          <Route path="/welcome" component={welcome} exact />
          <Route path="/complete-profile" component={CompleteProfile} exact />
  
        </Switch>
      </Router>
  );
};

export default App;
