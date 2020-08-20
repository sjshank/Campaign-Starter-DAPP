import React from 'react';
import { Switch, Route } from 'react-router-dom';
import CampaignsContainer from './containers/Campaigns';
import './App.css';
import Header from './components/Header';
import CampaignDetailsContainer from './containers/CampaignDetails';
import CreateCampaignContainer from './containers/CreateCampaign';
import RequestsContainer from './containers/Requests';

const App = () => {
  return (
    <>
      <Header></Header>
      <div className="App">
        <Switch>
          <Route path="/" exact component={CampaignsContainer}></Route>
          <Route path="/campaign/new" component={CreateCampaignContainer}></Route>
          <Route path="/campaign/:address/requests" component={RequestsContainer}></Route>
          <Route path="/campaign/:address" component={CampaignDetailsContainer}></Route>
        </Switch>
      </div>
      <small className="text-center m-5">*Make sure Blockchain client such as MetaMask is running in browser.*</small>
    </>
  );
}

export default App;
