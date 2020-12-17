import React, { useEffect } from "react";
import { BrowserRouter, Switch } from "react-router-dom";
import { GuardProvider } from "react-router-guards";
import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
import getRoutes from "./Route";
import RouteLayer from "./router/RouterLayer";
import useAppInit from "./hooks/useAppInit";
import useLoader from "./hooks/useLoader";
const routes = getRoutes();

const requireLogin = (to, from, next) => {
  next();
};

function App({ }) {

  useEffect(() => {
    console.log("Mount App.js");
    return () => console.log("Unmount App.js");
  }, []);

  useAppInit();
  useLoader();

  return <>
    <BrowserRouter basename={window.drupalSettings.lp_url_alias}>
      <GuardProvider
        guards={[requireLogin]}
        loading={() => <h1>Loading...</h1>}
        error={() => <h1>Error Page</h1>}
      >
        <Switch>
          {routes.map(({ component, exact, path, meta }, i) => {
            return (
              <RouteLayer
                key={i}
                exact={exact}
                component={component}
                path={path}
                meta={meta}
              />
            );
          })}
        </Switch>
      </GuardProvider>
    </BrowserRouter>
  </>
}

export default App;
