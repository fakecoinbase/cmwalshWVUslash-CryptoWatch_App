import {
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonListHeader,
    IonMenu,
    IonMenuToggle,
    IonTitle,
    IonToolbar,
    IonToggle
  } from '@ionic/react';
  import { cashOutline, newspaperOutline, statsChartOutline, personOutline, logOutOutline, logInOutline, personAddOutline } from 'ionicons/icons';
  import React from 'react';
  import { RouteComponentProps, withRouter } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { setUseDarkMode } from '../store/actions/userActions';
  
  const routes = {
    appPages: [
      { title: 'News', path: '/news', icon: newspaperOutline },
      { title: 'Current Prices', path: '/tickers', icon: statsChartOutline },
    ],
    loggedInPages: [
        { title: 'Holdings', path: '/holdings', icon: cashOutline },
        { title: 'Account', path: '/account', icon: personOutline },
        { title: 'Logout', path: '/logout', icon: logOutOutline }
    ],
    loggedOutPages: [
      { title: 'Login', path: '/login', icon: logInOutline },
      { title: 'Signup', path: '/signup', icon: personAddOutline }
    ]
  };
  
  interface Pages {
    title: string,
    path: string,
    icon: string,
    routerDirection?: string
  }
 
  interface MenuProps extends RouteComponentProps { }
  
  const Menu: React.FC<MenuProps> = ({  history }) => {
  
    const user = useSelector((state: any) => state.firebase.user)
    const useDarkMode = useSelector((state: any) => state.user.useDarkMode)

    const dispatch = useDispatch()

    function renderlistItems(list: Pages[]) {
      return list
        .filter(route => !!route.path)
        .map(p => (
          <IonMenuToggle key={p.title} auto-hide="false">
            <IonItem button routerLink={p.path} routerDirection="none">
              <IonIcon slot="start" icon={p.icon} />
              <IonLabel>{p.title}</IonLabel>
            </IonItem>
          </IonMenuToggle>
        ));
    }
  
    return (
      <IonMenu type="reveal" contentId="main">
        <IonHeader>
          <IonToolbar>
            <IonTitle>Menu</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent class="outer-content">
          <IonList>
            {renderlistItems(routes.appPages)}
          </IonList>
          <IonList>
            <IonListHeader>Account</IonListHeader>
            {user ? renderlistItems(routes.loggedInPages) : renderlistItems(routes.loggedOutPages)}
          </IonList>
          <IonList >
            <IonItem>
              <IonLabel>Dark Theme</IonLabel>
              <IonToggle checked={useDarkMode} onClick={() => dispatch(setUseDarkMode(!useDarkMode))} />
            </IonItem>
          </IonList>
        </IonContent>
      </IonMenu>
    );
  };
  
export default withRouter(Menu)
  
  