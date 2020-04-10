import { RouteComponentProps } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import React, { useEffect, useState } from "react";
import { IonPage, IonContent, IonHeader, IonTitle, IonToolbar, getConfig, IonFab, IonFabButton, IonIcon, IonModal, IonButton, IonButtons, IonCard, IonCardTitle, IonItem, IonList, IonMenuButton, IonInput, IonLabel, IonRow, IonCol } from "@ionic/react";
import { signout, updateUsersEmail, updateUsersPassword } from "../firebase/firebase";
import "./AccountsPage.scss"
import { toast } from "../components/toast";
 
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
        }
    }, []);

    const [showAlert, setShowAlert] = useState(false);
    const [showEditPassword, setShowEditPassword] = useState(false);
    const [updatedPassword, setUpdatedPassword] = useState("")
    const [updatedPasswordConfirmed, setUpdatedPasswordConfirmed] = useState("")

    const [showEditEmail, setShowEditEmail] = useState(false);
    const [updatedEmail, setUpdatedEmail] = useState("")
    const [updatedEmailConfirmed, setUpdatedEmailConfirmed] = useState("")

    const clicked = (text: string) => {
      console.log(`Clicked ${text}`);
    }

    const updateEmail = async (e: React.FormEvent) => {
      if (updatedEmail === "" || updatedEmailConfirmed === "") {
        toast("Email cannot be blank!")
        return
      } else if (updatedEmail !== updatedEmailConfirmed) {
        toast("Emails do not match!")
        return
      } else if(user.email !== updatedEmail) {
        const res: any = await updateUsersEmail(updatedEmail)
        if (res) {
          toast("Email updated successfully")
          setUpdatedEmail("")
          setUpdatedEmailConfirmed("")
        } else {
          toast("Error updating email")
        }
      } else {
        toast("Current and Updated email are the same")
      }
    }

    const updatePassowrd = async (e: React.FormEvent) => {
      if (updatedPassword === "" || updatedPasswordConfirmed === "") {
        toast("Updated password is blank")
      } else if(updatedPassword === updatedPasswordConfirmed) {
        const res: any = await updateUsersPassword(updatedPassword)
        if (res) {
          toast("Password updated successfully")
          setUpdatedPassword("")
          setUpdatedPasswordConfirmed("")
        } else {
          toast("Password updating password")
        }
      } else {
        toast("Passwords do not match")
      }
    }

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
                <IonItem className={"account-button"} onClick={() => {
                  setUpdatedEmail("")
                  setUpdatedEmailConfirmed("")
                  setShowEditPassword(false)
                  setShowEditEmail(!showEditEmail)
                }}>
                  Change Email
                  </IonItem>
                {
                  showEditEmail ? 

                  <IonCard className="ion-padding">
                    <IonItem>
                      <IonLabel position="stacked" color="primary">New Email</IonLabel>
                      <IonInput name="currentEmail" type="text" value={updatedEmail} spellCheck={false} autocapitalize="off"  onIonChange={e => setUpdatedEmail(e.detail.value!)}>
                      </IonInput>
                    </IonItem> 
                    <IonItem>
                      <IonLabel position="stacked" color="primary">Confirm Email</IonLabel>
                      <IonInput name="updatedEmail" type="text" value={updatedEmailConfirmed} spellCheck={false} autocapitalize="off" onIonChange={e => setUpdatedEmailConfirmed(e.detail.value!)}
                        required>
                      </IonInput>
                    </IonItem> 

                    <IonRow>
                      <IonCol>
                        <IonButton onClick={updateEmail} type="submit" expand="block">Update Email</IonButton>
                      </IonCol>
                    </IonRow>
                  </IonCard>
                  : null
                }
                <IonItem className={"account-button"} onClick={() => {
                  setUpdatedPassword("")
                  setUpdatedPasswordConfirmed("")
                  setShowEditEmail(false)
                  setShowEditPassword(!showEditPassword)}}
                  >
                    Change Password
                </IonItem>
                {
                  showEditPassword ? 

                  <IonCard className="ion-padding">
                    <IonItem>
                      <IonLabel position="stacked" color="primary">New Password</IonLabel>
                      <IonInput name="currentPassword" type="password" value={updatedPassword} spellCheck={false} autocapitalize="off" onIonChange={e => setUpdatedPassword(e.detail.value!)} >
                      </IonInput>
                    </IonItem> 
                    <IonItem>
                      <IonLabel position="stacked" color="primary">Confirm New Password</IonLabel>
                      <IonInput name="updatedPassword" type="password" value={updatedPasswordConfirmed} spellCheck={false} autocapitalize="off" onIonChange={e => setUpdatedPasswordConfirmed(e.detail.value!)}
                        required>
                      </IonInput>
                    </IonItem> 

                    <IonRow>
                      <IonCol>
                        <IonButton onClick={updatePassowrd} type="submit" expand="block">Update Password</IonButton>
                      </IonCol>
                    </IonRow>
                  </IonCard>
                  : null
                }
                <IonItem className={"account-button"} onClick={() => signout()} routerLink="/landing" routerDirection="none">Logout</IonItem>
              </IonList>
            </div>)
          }
        </IonContent>
        
      </IonPage>
    );
  };
  
  export default AccountPage;
