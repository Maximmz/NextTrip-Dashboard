import React, { useContext } from "react";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
// routes
import Router from "./routes";
// theme
import ThemeProvider from "./theme";
// components
import { StyledChart } from "./components/chart";
import ScrollToTop from "./components/scroll-to-top";
import LoginForm from "./pages/LoginPage";
import { AuthContext } from "./hooks/AuthContext";

// ----------------------------------------------------------------------

export default function App() {
  const { user } = useContext(AuthContext);

  return (
    <HelmetProvider>
      <BrowserRouter>
        <ThemeProvider>
          <ScrollToTop />
          {user ? (
            <>
              <StyledChart />
              <Router />
            </>
          ) : (
            <LoginForm />
          )}
        </ThemeProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}
