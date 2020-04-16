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
  IonSpinner,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonMenuButton,
  isPlatform
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { cashOutline, personOutline, newspaperOutline, statsChartOutline, menu } from 'ionicons/icons';

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
import Menu from './components/Menu';
import { setAccessToken, setCoinbaseAuth } from './store/actions/coinbaseActions';
import axios from 'axios';

const Routes: React.FC = () => {

  return (
    <IonRouterOutlet id="main">
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
      <Route path="/holdings" render={(props) =>  {
        return <HoldingsPage urlProps={props.location.search} />}
        } />
      <Route path="/account" component={AccountPage} />
    </IonRouterOutlet>
  )
}

const MenuApp: React.FC = () => {
  return (
    <IonReactRouter>
      
      <Menu />
      <Routes />
    </IonReactRouter>
  )
}


const TabsApp: React.FC = () => {
  const user = useSelector((state: any) => state.firebase.user)
  const dispatch = useDispatch() 

  const coinbaseAuth = (code:any) => {
    console.log(code)
    axios.post(`https://us-central1-crypto-watch-dbf71.cloudfunctions.net/tokenHodl`, { 'code': code })
      .then(res => {
          console.log(res);
          console.log(res.data);
          dispatch(setCoinbaseAuth(true))
          dispatch(setAccessToken(res.data.authToken))
          return true
      }).catch((err) => {
        console.log(err)
        return false
      })

  }

  return (
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet id="main">
          <Route path="/redirect" render={(props) => {
            console.log(props.location.search)
            coinbaseAuth(props.location.search.replace('?code=',''))
            return <Redirect exact to={"/holdings"} />
            }
          }/>
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
          <Route path="/holdings" render={(props) =>  {
            return <HoldingsPage urlProps={props.location.search} />}
           } />
          <Route path="/account" component={AccountPage} />
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="holdings" href={user !== null ? "/holdings" : "/landing"}>
            <IonIcon icon={cashOutline} />
            <IonLabel>Holdings</IonLabel>
          </IonTabButton>
          <IonTabButton tab="news" href="/news">
            <IonIcon icon={newspaperOutline} />
            <IonLabel>News</IonLabel>
          </IonTabButton>
          <IonTabButton  tab="tickers" href="/tickers">
            <IonIcon icon={statsChartOutline} />
            <IonLabel>Prices</IonLabel>
          </IonTabButton>
          <IonTabButton tab="account" href={user !== null ? "/account" : "/landing"}>
            <IonIcon icon={personOutline} />
            <IonLabel>Account</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  )
}

const App: React.FC = () => {
  const [busy, setBusy] = useState(true)
  const dispatch = useDispatch() 
  const useDarkMode = useSelector((state: any) => state.user.useDarkMode)

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
    <IonApp className={useDarkMode ? 'dark-theme' : 'light-mode'} >
      <div className="body">
      
          {busy ? <IonSpinner /> : 
            isPlatform("mobile") ? 
              <TabsApp/> : <MenuApp/>}
        </div>
    </IonApp>
  )
}

export default App;
