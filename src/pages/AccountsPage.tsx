import { RouteComponentProps } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import React, { useEffect, useState } from "react";
import { IonPage, IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonButtons, IonCard, IonItem, IonList, IonMenuButton, IonInput, IonLabel, IonRow, IonCol, IonToggle, isPlatform } from "@ionic/react";
import { signout, updateUsersEmail, updateUsersPassword } from "../firebase/firebase";
import "./AccountsPage.scss"
import { toast } from "../components/toast";
import { setUseDarkMode } from "../store/actions/userActions";
 
interface OwnProps extends RouteComponentProps {}

const AccountPage: React.FC<OwnProps> = ({ history }) => {
    
    const user = useSelector((state: any) => state.firebase.user)
    useEffect(() => {
        if (!user) {
            history.push("/landing")
        }
    }, []);

    const dispatch = useDispatch()
    const useDarkMode = useSelector((state: any) => state.user.useDarkMode)

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
        {isPlatform("mobile") ? 
          <IonHeader>
            <IonToolbar>
              <IonTitle>Account</IonTitle>
            </IonToolbar>
          </IonHeader>
          :
          <IonHeader>
            <IonToolbar>
              <IonTitle>HODL Watch</IonTitle>
              <IonButtons slot="start">
                  <IonMenuButton></IonMenuButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
        }
        <IonContent>
          {user &&
            (<div className="ion-padding-top ion-text-center">
              <img src="https://www.gravatar.com/avatar?d=mm&s=140" alt="avatar" />
              <h2>{ user.name }</h2>
              <IonList inset>
                <IonItem onClick={() => clicked('Update Picture')}>Update Picture</IonItem>
                <IonItem className={useDarkMode ? "account-button" : "account-button-light"} onClick={() => {
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
                <IonItem className={useDarkMode ? "account-button" : "account-button-light"} onClick={() => {
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
                <IonItem>
                  <IonLabel>Use Dark Theme</IonLabel>
                  <IonToggle checked={useDarkMode} onClick={() => dispatch(setUseDarkMode(!useDarkMode))} />
                </IonItem>
                <IonItem className={useDarkMode ? "account-button" : "account-button-light"} onClick={() => signout()} routerLink="/landing" routerDirection="none">Logout</IonItem>
              </IonList>
            </div>)
          }
        </IonContent>
        
      </IonPage>
    );
  };
  
  export default AccountPage;
