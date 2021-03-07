import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Link, Route, Switch } from 'react-router-dom';
import BackContainer from './Pages/BackContainer';
import Categories from './Pages/BackOffice/Categories';
import Vehicules from './Pages/BackOffice/Vehicules';
import Clients from './Pages/BackOffice/Clients';
import Devis from './Pages/BackOffice/Devis';

function Stats() {
  return (
    <div className="Stats">
      <BackContainer />
      <Switch>
        <Route path="/backoffice/Categories" component={Categories} />
        <Route path="/backoffice/Vehicules" component={Vehicules} />
        <Route path="/backoffice/Clients" component={Clients} />
        <Route path="/backoffice/Devis" component={Devis} />
      </Switch>
    </div>
  );
}

export default Stats;
