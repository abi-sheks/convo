import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { extendTheme } from '@chakra-ui/react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Home, LoginScreen, Profile, RegisterScreen, ProfileList, Feed } from './routes';
import { persistor, store } from "./app/store";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import './index.css'

const router = createBrowserRouter([
  {
    path : "/",
    element : <Home />,
    children : [
      {
        path : "/feed",
        element : <Feed />
      },
      {
        path : "/profiles",
        element: <ProfileList />
      },
      {
        path : "/profiles/:username",
        element: <Profile />
      }
    ]
  },
  {
    path: "/login",
    element: <LoginScreen />
  },
  {
    path: "/register",
    element: <RegisterScreen />
  },

])

const customTheme = extendTheme({
  colors: {
    primary: {
      100: "#F1FCCF",
      200: "#E1F9A0",
      300: "#C6EF6F",
      400: "#AAE04A",
      500: "#83CC16",
      600: "#69AF10",
      700: "#51920B",
      800: "#3C7607",
      900: "#2D6104",
    },
    secondary: "#ffffff",
    bg: "#EEEEEE",
    tertiary: "#44403C",
  }
})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <PersistGate persistor={persistor} loading={null}>
      <ChakraProvider theme={customTheme}>
        <RouterProvider router={router} />
      </ChakraProvider>
    </PersistGate>
  </Provider>
);
