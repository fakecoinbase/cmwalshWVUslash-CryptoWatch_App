import { RouteComponentProps } from "react-router-dom";
import './Login.scss';
import React, { useEffect } from 'react';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonButtons, IonMenuButton, IonRow, IonCol, IonButton } from '@ionic/react';
import './Login.scss';
import { useSelector } from "react-redux";

interface OwnProps extends RouteComponentProps {}

const LandingPage: React.FC<OwnProps> = ({  history }) => {

    const user = useSelector((state: any) => state.firebase.user)
    useEffect(() => {
        if (user !== null) {
            // history.push()
        }
    }, []);
    return (
      <IonPage id="landing-page">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton></IonMenuButton>
            </IonButtons>
            <IonTitle>Login</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
  
          <div className="login-logo">
            <img className={"logo"} src="assets/icon/logo.png" alt="Ionic logo" />
          </div>
          <div className="col s12 center-align">

          <h4>

          <span style={{ fontFamily: "monospace" }}>Are you {" "}</span> 
              <b>HODLING?</b>
            </h4>
            <p className="flow-text grey-text text-darken-1">
              The one App for all of your HODL needs.
            <br />
            </p>
            </div>
          
            <IonRow>
              <IonCol>
                <IonButton className={"black-text"} routerLink="/login" expand="block">Login</IonButton>
              </IonCol>
              <IonCol>
                <IonButton routerLink="/signup" color="light" expand="block">Signup</IonButton>
              </IonCol>
            </IonRow>  
        </IonContent>
  
      </IonPage>
    );
  };

  export default LandingPage;
