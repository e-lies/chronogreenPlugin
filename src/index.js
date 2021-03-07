import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, BrowserRouter, Route, Switch } from "react-router-dom";
import "./index.css";
import ServerContext from "./context/ServerContext";
import SessionContext from "./context/SessionContext";
import FormsContext from "./context/Forms";
import GeolocationContext from "./context/GeolocationContext";
import BackOffice from "./BackOffice";
import Plugin from './Plugin';
import NotFound from "./NotFound";
//import reportWebVitals from './reportWebVitals';
//import * as serviceWorker from "./serviceWorker";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import Theme from './Themes/Red';

const theme = createMuiTheme(Theme);
const Rout = () => (
  <Switch>
    <Route path="/backoffice" component={BackOffice} />
    <Route path="/" component={Plugin} />
    <Route default comp={NotFound} />
  </Switch>
);

ReactDOM.render(
  <ThemeProvider theme={theme}>
  <BrowserRouter>
    {/*<SessionContext>*/}
      <ServerContext>
        <FormsContext>   
          <GeolocationContext>
            <Rout />
          </GeolocationContext>
        </FormsContext>
      </ServerContext>
    {/*</SessionContext>*/}
  </BrowserRouter>
  </ThemeProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
