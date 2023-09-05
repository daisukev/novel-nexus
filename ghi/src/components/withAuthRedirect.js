import React, { useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import useToken from "../jwt.tsx";

const withAuthRedirect = (WrappedComponent) => {
  return function AuthRedirectWrapper(props) {
    const { token, tokenFetchError, fetchToken } = useToken();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
      fetchToken();
    }, [token]);

    useEffect(() => {
      if (tokenFetchError) {
        const prev = location.pathname;
        navigate(`/accounts/login/?prev=${prev}`);
      }
    }, [tokenFetchError, navigate, location]);

    return <WrappedComponent {...props} />;
  };
};

export default withAuthRedirect;
