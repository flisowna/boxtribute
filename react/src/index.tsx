import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import Auth0ProviderWithHistory from "./Auth0ProviderWithHistory";
import ApolloWrapper from "./ApolloWrapper";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { ChakraProvider, CSSReset, extendTheme } from "@chakra-ui/react";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import { GlobalPreferencesProvider } from "GlobalPreferencesProvider";

const colors = {
  brand: {
    900: "#1a365d",
    800: "#153e75",
    700: "#2a69ac",
  },
  primary: {
    700: "light-blue",
    500: "blue",
  },
};

const theme = extendTheme({ colors });

const AuthenticationProtectedApp = withAuthenticationRequired(App);

ReactDOM.render(
  <ChakraProvider theme={theme}>
    <CSSReset />
    <BrowserRouter>
      <Auth0ProviderWithHistory>
        <ApolloWrapper>
          <GlobalPreferencesProvider>
            <AuthenticationProtectedApp />
          </GlobalPreferencesProvider>
        </ApolloWrapper>
      </Auth0ProviderWithHistory>
    </BrowserRouter>
  </ChakraProvider>,
  document.getElementById("root"),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
