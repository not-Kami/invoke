import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/header.js';
import Footer from './components/F-footer.js';
import Home from './pages/home.js';

function App() {
  return (
    <Router>
      <Header />
      <Switch>
        <Route path="/" exact component={Home} />
        {/* More routes can be added here */}
      </Switch>
      <Footer />
    </Router>
  );
}

export default App;
