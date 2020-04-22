import React, { useState } from 'react';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonButtons, IonMenuButton, IonRow, IonCol, IonButton, IonList, IonItem, IonLabel, IonInput, IonText, IonLoading } from '@ionic/react';
import './Login.scss';
import { RouteComponentProps } from 'react-router';
import { toast } from '../components/toast';
import { registerUser } from '../firebase/firebase';
import { useSelector } from 'react-redux';


interface OwnProps extends RouteComponentProps {}

const Signup: React.FC<OwnProps> = (props, {setIsLoggedIn, history, setUsername: setUsernameAction}) => {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [password2Error, setPassword2Error] = useState(false);
  const [loading, setLoading] = useState(false)
  const useDarkMode = useSelector((state: any) => state.user.useDarkMode)

  const signup = async (e: React.FormEvent) => {
    setLoading(true)
    e.preventDefault();
    setFormSubmitted(true);
    if(!name) {
      toast("Name is required")
      setNameError(true);
    }
    if(!email) {
      toast("Email is required")
      setUsernameError(true);
    }
    if(!password) {
      toast("Password is required")
      setPasswordError(true);
    }
    if(!password2) {
      toast("Password confirmation is required")
      setPassword2Error(true);
    }
    if(password !== password2) {
      toast("Passwords do not match")
      setPasswordError(true);
      setPassword2Error(true);
    }

    if(name && email && password && (password2 === password)) {
      const newUser = {
        name: name,
        email: email,
        password: password,
        password2: password2
      };

      const res = await registerUser(newUser);

      if (res) {
        toast("Registration Success!", 4000)
        props.history.push('/tabs/holdings', {direction: 'none'});
      }
      setLoading(false)
    }
  };

  return (
    <IonPage id="signup-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton></IonMenuButton>
          </IonButtons>
          <IonTitle>Signup</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonLoading message={"Registration in progress!"} duration={0} isOpen={loading} />
        <div className="login-logo">
          <img className={"logo"} src={useDarkMode ? `assets/icon/logo.png` : `assets/icon/lightLogo.png`} alt="Ionic logo" />
        </div>

        <form noValidate onSubmit={signup}>
          <IonList>
            <IonItem>
              <IonLabel position="stacked" color="primary">Name</IonLabel>
              <IonInput name="name" type="text" value={name} spellCheck={false} autocapitalize="off" onIonChange={e => setName(e.detail.value!)}
                required>
              </IonInput>
            </IonItem>
            {formSubmitted && nameError && <IonText color="danger">
              <p className="ion-padding-start">
                Name is required
              </p>
            </IonText>}
            <IonItem>
              <IonLabel position="stacked" color="primary">Email</IonLabel>
              <IonInput name="email" type="text" value={email} spellCheck={false} autocapitalize="off" onIonChange={e => setEmail(e.detail.value!)}
                required>
              </IonInput>
            </IonItem> 

            {formSubmitted && usernameError && <IonText color="danger">
              <p className="ion-padding-start">
                Username is required
              </p>
            </IonText>}

            <IonItem>
              <IonLabel position="stacked" color="primary">Password</IonLabel>
              <IonInput name="password" type="password" value={password} onIonChange={e => setPassword(e.detail.value!)}>
              </IonInput>
            </IonItem>

            {formSubmitted && passwordError && <IonText color="danger">
              <p className="ion-padding-start">
                Password is required
              </p>
            </IonText>}

            <IonItem>
              <IonLabel position="stacked" color="primary">Confirm Password</IonLabel>
              <IonInput name="password2" type="password" value={password2} onIonChange={e => setPassword2(e.detail.value!)}>
              </IonInput>
            </IonItem>

            {formSubmitted && password2Error && <IonText color="danger">
              <p className="ion-padding-start">
                Password is required
              </p>
            </IonText>}
          </IonList>

          <IonRow>
            <IonCol>
              <IonButton className={"black-text"} routerLink="/login" expand="block">Login</IonButton>
            </IonCol>
            <IonCol>
              <IonButton type="submit" routerLink="/signup" color="light" expand="block">Signup</IonButton>
            </IonCol>
          </IonRow>
        </form>

      </IonContent>

    </IonPage>
  );
};

export default Signup