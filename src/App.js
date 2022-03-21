import React, { useEffect, useRef } from "react";
import LoginPage from "./pages/LoginPage/LoginPage";
import { useStore } from "./store/storeContext";
import { GlobalStyles } from "./styles/GlobalStyles";
import HomePage from "./pages/HomePage/HomePage";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import "./styles/styles.css";
import { useScreenActions } from "./actions/screenActions";
import { useRemoteSoftwareActions } from "./actions/remotesoftwareActions";
import WarningPage from "./pages/WarningPage/WarningPage";
import CheckCohort from "./pages/CheckCohort/CheckCohort";

const App = () => {
  const { dispatch } = useStore();

  const { verifyExternalDisplay } = useScreenActions(dispatch);
  const { verifyRemoteAccessSoftware } = useRemoteSoftwareActions(dispatch);
  const initialTrackingValues = useRef({
    callVerifyExternalDisplay: verifyExternalDisplay,
    callVerifyRemoteAccessSoftware: verifyRemoteAccessSoftware,
  });
  useEffect(() => {
    const { callVerifyExternalDisplay } = initialTrackingValues.current;
    callVerifyExternalDisplay();
  }, []);
  useEffect(() => {
    const { callVerifyRemoteAccessSoftware } = initialTrackingValues.current;
    callVerifyRemoteAccessSoftware();
  }, []);

  return (
    <Router>
      <GlobalStyles />

      <Switch>
        <Route exact path="/" component={LoginPage} />
        <Route exact path="/warning" component={WarningPage} />
        <Route exact path="/login" component={LoginPage} />
        <Route exact path="/home" component={HomePage} />
        {/* wrongCohort */}
        {/* <Layout>
          <Route exact path="/home" component={HomePage} />
          <Route exact path="/" component={HomePage} />
          <Route exact path='/' component={LoginPage} />
          <Route exact path="/login" component={LoginPage} />
          <Route exact path='/cohort/:cohortId' component={CohortPage} />
        </Layout> */}
      </Switch>
    </Router>
  );
};

export default App;
