import React from 'react';
import Header from './components/Header';
import PageLayout from './components/PageLayout';
import Calendar from './containers/Calendar';
import { Switch, Route } from 'react-router-dom';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const App = () => {
  return (
    <div className="app">
      <Header></Header>
      <PageLayout>
        <Switch>
          <Route path="/" exact component={Calendar}></Route>
        </Switch>
      </PageLayout>
    </div>
  );
}

export default App;
