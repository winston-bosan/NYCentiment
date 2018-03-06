import React from 'react';
import { Route, Link } from 'react-router-dom';
import Map from '../map';
import About from '../about';

const App = () => (
  <div>
    {/* <header>
      <Link to="/">Home</Link>
      <Link to="/about-us">About</Link>
    </header> */}

    <main>
      <Route exact path="/" component={Map} />
      <Route exact path="/about-us" component={About} />
    </main>
  </div>
);

export default App;
