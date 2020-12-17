import React from "react";
import {GuardedRoute } from 'react-router-guards';

const RouteLayer = ({meta, path, exact, component}) => {
  React.useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  return (
    <GuardedRoute exact={exact} meta={meta} path={path}  component={component}/>
  );
};

export default RouteLayer;
