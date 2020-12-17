const asyncMiddleware = () => next => action => {
  const {types, actions, promise, ...rest} = action;
  if (!promise) {
    return next(action);
  }

  if (types) {
    const [REQUEST, SUCCESS, FAILURE] = types;
    next({...rest, type: REQUEST});
    promise().then(
      result => next({type: SUCCESS, payload: result, meta: rest}),
      error => next({type: FAILURE, error, meta: rest}),
    );
  } else if (actions) {
    const [request, success, failure] = actions;
    next(request(...rest));
    promise().then(
      result => next(success(result, ...rest)),
      error => next(failure(error, ...rest)),
    );
  }
};

export default asyncMiddleware;