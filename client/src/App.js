import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Header from "./components/Header";
import Signup from "./pages/signup";
import Publish from "./pages/publish";
import User from "./pages/user";
import Main from "./pages/main";
import SinglePhoto from "./pages/singlePhoto";
// import MainCarousel from "./pages/MainCarousel";
import AlbumView from "./pages/AlbumView";

const App = () =>
  <Router>
    <div>
      <Header />
      <Switch>
        <Route exact path="/" component={Main} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/publish" component={Publish} />
        <Route exact path="/album/:id" component={AlbumView} />
        <Route exact path="/user/:id" component={User} />
        <Route exact path="/photo/:id" component={SinglePhoto} />
      </Switch>
    </div>
  </Router>;

export default App;

