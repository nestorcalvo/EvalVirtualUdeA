import React, { useEffect, useRef } from 'react'
import { LoginPage } from './pages/LoginPage'
import { Layout } from './components/Layout'
import { useStore } from './store/storeContext'
import { GlobalStyles } from './styles/GlobalStyles'
import { HomePage } from './pages/Home'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import Biometrics from './pages/Biometrics'
import './styles/styles.css'
import { useScreenActions } from './actions/screenActions'
import { useRemoteSoftwareActions } from './actions/remotesoftwareActions'
import { WarnPage } from './pages/WarnPage'
import { ConfirmActionPage } from './pages/ConfirmAction'
import { CohortPage } from './pages/CohortPage'

const App = () => {
  const {
    dispatch
  } = useStore()

  const { verifyExternalDisplay } = useScreenActions(dispatch)
  const { verifyRemoteAccessSoftware } = useRemoteSoftwareActions(dispatch)
  const initialTrackingValues = useRef({
    callVerifyExternalDisplay: verifyExternalDisplay,
    callVerifyRemoteAccessSoftware: verifyRemoteAccessSoftware
  })
  useEffect(() => {
    const { callVerifyExternalDisplay } = initialTrackingValues.current
    callVerifyExternalDisplay()
  }, [])
  useEffect(() => {
    const { callVerifyRemoteAccessSoftware } = initialTrackingValues.current
    callVerifyRemoteAccessSoftware()
  }, [])

  // A wrapper for <Route> that redirects to the login
  // screen if you're not yet authenticated.
  /**
   * //TODO
  const PrivateRoute = ({ component: Component, ...rest }) => {
    return <Route
      {...rest} render={(props) => (
        auth.isAuth
          ? <Component {...props} />
          : <Redirect
            exact
            to={{
              pathname: '/login',
              state: { from: props.location }
            }}
          />
      )}
           />
  }
   */

  return (
    <Router>
      <GlobalStyles />

      <Switch>
        <Route exact path='/biometrics' component={Biometrics} />
        <Route exact path='/warn' component={WarnPage} />
        <Route exact path='/confirm' component={ConfirmActionPage} />
        <Layout>
          <Route exact path='/home' component={HomePage} />
          <Route exact path='/' component={LoginPage} />
          <Route exact path='/login' component={LoginPage} />
          {/* <Route exact path='/cohort/:cohortId' component={CohortPage} /> */}
        </Layout>

      </Switch>

    </Router>
  )
}

export default App
