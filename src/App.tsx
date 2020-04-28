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
  isPlatform
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { cashOutline, personOutline, newspaperOutline, statsChartOutline } from 'ionicons/icons';

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
import { getCurrentUser, signout, getTopCryptos, firebaseClient } from './firebase/firebase';
import { setUserState, setHoldingsHistory } from './store/actions/firebaseActions';
import NewsPage from './pages/NewsPage';
import TickersPage from './pages/TickersPage';
import HoldingsPage from './pages/HoldingsPage';
import AccountPage from './pages/AccountsPage';
import Menu from './components/Menu';
import { setAccessToken, setCoinbaseAuth, setHoldingsMap, setAdditionalHoldings, setCoinbaseHoldings, setHoldingsList } from './store/actions/coinbaseActions';
import { updateCurrentPrices } from './store/actions/currentPricesActions';
import Pusher from 'pusher-js';
import { updateFeed, setFeed } from './store/actions/newsActions';

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

  return (
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet id="main">
          <Route path="/landing" component={LandingPage} exact={true} />
          <Route path="/news" component={NewsPage} />
          <Route path="/" render={() => <Redirect to="/news" />} exact={true} />
          <Route path="/login" component={Login} />
          <Route path="/logout" render={() => {
              dispatch(setHoldingsHistory([]))
              dispatch(setHoldingsMap([]))
              dispatch(setCoinbaseAuth(false))
              dispatch(setAccessToken(null))
              dispatch(setAdditionalHoldings([]))
              dispatch(setCoinbaseHoldings([]))
              dispatch(setHoldingsList([]))
              dispatch(setUserState(null))
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
    const topCryptos = firebaseClient.firestore().collection('top').doc('top20')
    topCryptos.onSnapshot(querySnapshot => {
        dispatch(updateCurrentPrices(querySnapshot.data()!.top20))
    }, err => {
        console.log(`Encountered error: ${err}`);
    });
  }, []);

  useEffect(() => {
    fetch('https://mighty-dawn-74394.herokuapp.com/live')
      .then(response => response.json())
      .then(articles => {
          // dispatch(updateN(articles.articles))
          dispatch(setFeed(articles))
      }).catch(error => console.log(error));
    const pusher = new Pusher('5994b268d4758d733605', {
        cluster: 'us2',
        encrypted: true
    });
    pusher.subscribe('news-channel').bind('update-news', (data: any) => {
        // news.push(data.articles)
        dispatch(updateFeed(data.articles))
    })
  }, [])

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
