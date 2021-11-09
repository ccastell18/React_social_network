import React, { useHistory } from 'react';

export const withRouter = (Component) => {
  const Wrapper = (props) => {
    const history = useHistory();

    return <Component history={history} {...props} />;
  };
  return Wrapper;
};
