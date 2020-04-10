import { RouteComponentProps } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import React, { useEffect, useState } from "react";
import { IonPage, IonContent, IonHeader, IonTitle, IonToolbar, getConfig, IonFab, IonFabButton, IonIcon, IonModal, IonButton, IonButtons, IonCard, IonCardTitle, IonItem, IonList, IonMenuButton } from "@ionic/react";
import { signout } from "../firebase/firebase";
import "./AccountsPage.scss"
 
interface OwnProps extends RouteComponentProps {}

const AccountPage: React.FC<OwnProps> = ({ history }) => {
    
    const mode = getConfig()!.get('mode')

    const [showTransactionModal, setShowTransactionModal] = useState(false)

    const holdingsHistory = useSelector((state: any) => state.firebase.holdingsHistory)
    const currentPrices = useSelector((state: any) => state.prices.currentPrices)
    const cbHoldings = useSelector((state: any) => state.coinbase.cbHoldings)
    const additionalHoldings = useSelector((state: any) => state.coinbase.additionalHoldings)
    const lastUpdated = useSelector((state: any) => state.coinbase.lastUpdated)
    
    const dispatch = useDispatch()
    const user = useSelector((state: any) => state.firebase.user)
    useEffect(() => {
        if (!user) {

            history.push("/landing")
            // dispatch(setLoadingHoldings(true))
            // getTopCryptos().then((resp) => {
            //     dispatch(updateCurrentPrices(resp));
            // }).catch(err => console.log(err));
            // getDailyHoldingsHistory(user.uid).then((resp: any) => {
            //     dispatch(setHoldingsHistory(resp))
            // })
            // getCoinbaseHoldings(user.uid).then((resp:any) => {
            //     dispatch(setCoinbaseHoldings(resp))
            // })
            // getAdditionalHoldings(user.uid).then((resp:any) => {
            //     dispatch(setAdditionalHoldings(resp))
            // })
            // dispatch(setLoadingHoldings(false))
        }
    }, []);
    const [showAlert, setShowAlert] = useState(false);

    const clicked = (text: string) => {
      console.log(`Clicked ${text}`);
    }
  
    console.log(user)
    return (
      <IonPage id="account-page">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton></IonMenuButton>
            </IonButtons>
            <IonTitle>Account</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          {user &&
            (<div className="ion-padding-top ion-text-center">
              <img src="https://www.gravatar.com/avatar?d=mm&s=140" alt="avatar" />
              <h2>{ user.name }</h2>
              <IonList inset>
                <IonItem onClick={() => clicked('Update Picture')}>Update Picture</IonItem>
                <IonItem onClick={() => setShowAlert(true)}>Change Username</IonItem>
                <IonItem onClick={() => clicked('Change Password')}>Change Password</IonItem>
                <IonItem routerLink="/support" routerDirection="none">Support</IonItem>
                <IonItem onClick={() => signout()} routerLink="/landing" routerDirection="none">Logout</IonItem>
              </IonList>
            </div>)
          }
        </IonContent>
        
      </IonPage>
    );
  };
  
  export default AccountPage;
