import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

interface LoginInterface {
  username: string;
  password: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RegistrationData = LoginInterface | any;

/**
 * Gets token from API using cookie as credential
 * @internal
 */
export const getToken = async (baseUrl: string): Promise<string> => {
  return fetch(`${baseUrl}/token`, {
    credentials: "include",
  })
    .then((response: Response) => response.json())
    .then((data) => data?.access_token ?? null)
    .catch(console.error);
};

/**
 * Object containing the state of AuthContext. This is
 * returned by useAuthContext and is useful to retrieve the
 * token provided by the backend.
 * @public
 */
export type AuthContextType = {
  token: string | null;
  setToken: Dispatch<SetStateAction<string | null>>;
  baseUrl: string;
};

/**
 * Context Hook for authentication. Store token and other
 * data.
 * @public
 */
export const AuthContext = createContext<AuthContextType>({
  token: null,
  setToken: () => null,
  baseUrl: "",
});

/**
 *
 */
interface AuthProviderProps {
  children: ReactNode;
  baseUrl: string;
}

/**
 * React context provider that provides AuthContext to
 * application, which should be a child node of this component.
 * @param props - Children and optionally URL to retrieve API
 * token.
 * @public
 */
export const AuthProvider = (props: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(null);
  const { children, baseUrl } = props;

  return (
    <AuthContext.Provider value={{ token, setToken, baseUrl }}>
      <TokenNode />
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Context Hook.
 * @public
 */
export const useAuthContext = () => useContext(AuthContext);

/**
 * Hook that provides token, register, login, logout,
 * fetchWithCookie, and fetchWithToken
 * @public
 */
const useToken = () => {
  const { token, setToken, baseUrl } = useAuthContext();

  useEffect(() => {
    const fetchToken = async () => {
      const token = await getToken(baseUrl);
      setToken(token);
    };
    if (!token) {
      fetchToken();
    }
  }, [setToken]);

  /**
   * Logs out and deletes token state, then deletes token and
   * navigates to '/'.
   */
  const logout = async () => {
    if (token) {
      const url = `${baseUrl}/token`;
      fetch(url, { method: "delete", credentials: "include" })
        .then(() => {
          setToken(null);
          // Delete old token
          document.cookie =
            "fastapi_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        })
        .catch(console.error);
    }
  };

  /**
   * Login to set API token.
   * @param username - Username of existing account
   * @param password - Password of existing account
   */
  const login = async (username: string, password: string) => {
    const url = `${baseUrl}/token`;
    const form = new FormData();
    form.append("username", username);
    form.append("password", password);
    await fetch(url, {
      method: "post",
      credentials: "include",
      body: form,
    })
      .then(() => getToken(baseUrl))
      .then((token: string | null) => {
        if (token) {
          setToken(token);
        } else {
          throw new Error(`Failed to get token after login. Got ${token}`);
        }
      });
  };

  /**
   * Register user account with API service. Logs in after
   * registration.
   * @param userData - Account data to be created or updated.
   * @param url - API endpoint to update or create account.
   * @param method - Method to use in request.
   */
  const register = async (
    userData: RegistrationData,
    url: string,
    method = "POST"
  ) => {
    fetch(url, {
      method: method,
      body: JSON.stringify(userData),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(() => login(userData.username, userData.password))
      .catch(console.error);
  };

  /**
   * Get data from service that provided login token. Use
   * this with your account service.
   * @param url - API endpoint to request
   * @param method - Method to use in request.
   * @param options - Additional options to use in fetch
   * request. For more information, see
   * https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#supplying_request_options
   */
  const fetchWithCookie = async (
    url: string,
    method = "GET",
    options: object = {}
  ): Promise<any> => {
    return fetch(url, {
      method: method,
      credentials: "include",
      ...options,
    })
      .then((resp: Response) => resp.json())
      .catch(console.error);
  };

  /**
   * Get data from service that provided login token. Use
   * this with APIs other than the account service.
   * @param url - API endpoint to request
   * @param method - Method to use in request.
   * @param options - Additional options to use in fetch
   * request. For more information, see
   * https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#supplying_request_options
   */
  const fetchWithToken = async (
    url: string,
    method = "GET",
    otherHeaders: object = {},
    options: object = {}
  ): Promise<any> => {
    const response = await fetch(url, {
      method: method,
      headers: { Authorization: `Bearer ${token}`, ...otherHeaders },
      ...options,
    });

    if (!response.ok) {
      throw new Error("Request Failed");
    }
    return await response.json();
  };

  return { token, register, login, logout, fetchWithCookie, fetchWithToken };
};

export default useToken;

const TokenNode = () => {
  useToken();
  return null;
};
