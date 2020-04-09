import React, { useState, useEffect } from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonSpinner
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { person, newspaper, statsChart, cash, logOut, cashOutline, personOutline, newspaperOutline, statsChartOutline } from 'ionicons/icons';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser, signout } from './firebase/firebase';
import { setUserState } from './store/actions/firebaseActions';
import NewsPage from './pages/NewsPage';
import TickersPage from './pages/TickersPage';
import HoldingsPage from './pages/HoldingsPage';
import AccountPage from './pages/AccountsPage';


const RoutingSystem: React.FC = () => {
  const user = useSelector((state: any) => state.firebase.user)

  return (
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route path="/landing" component={LandingPage} exact={true} />
          <Route path="/news" component={NewsPage} />
          <Route path="/" render={() => <Redirect to="/news" />} exact={true} />
          <Route path="/login" component={Login} />
          <Route path="/logout" render={() => {
              signout()
              return <Redirect exact to={"/landing"} />
            }
          } />
          <Route path="/signup" component={Signup} />
          <Route path="/tickers" component={TickersPage} />
          <Route path="/holdings" component={HoldingsPage} />
          <Route path="/account" component={AccountPage} />
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="tab0" href={user !== null ? "/account" : "/landing"}>
            <IonIcon icon={personOutline} />
            <IonLabel>Account</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tab1" href={user !== null ? "/holdings" : "/landing"}>
            <IonIcon icon={cashOutline} />
            <IonLabel>Holdings</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tab2" href="/news">
            <IonIcon icon={newspaperOutline} />
            <IonLabel>News</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tickers" href="/tickers">
            <IonIcon icon={statsChartOutline} />
            <IonLabel>Tickers</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  )
}

const App: React.FC = () => {
  const [busy, setBusy] = useState(true)
  const dispatch = useDispatch() 

  useEffect(() => {
    getCurrentUser().then(user => {
      if (user) {
        dispatch(setUserState(user))
        // window.history.replaceState({}, "/news", "/news")
      } else {
        window.history.replaceState({}, "", "/landing")
      }
      setBusy(false)
    })
  }, []);

  return (
  <IonApp className={'dark-theme'} >
     <div className="body">
        {busy ? <IonSpinner /> : <RoutingSystem />}
      </div>
  </IonApp>
  )
}

export default App;