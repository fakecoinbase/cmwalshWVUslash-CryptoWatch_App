import React, { useState, Dispatch, SetStateAction } from 'react';
import { IonItem, IonLabel, IonToggle, IonSegment, IonSegmentButton, IonContent, IonCard, IonTitle, IonInput, IonButton, IonIcon } from '@ionic/react';
import './newTransactionDialog.scss'
import { useSelector } from 'react-redux';
import { recordTransaction } from '../firebase/firebase';

interface OwnProps {
    dimissModal: any
}

const NewTransactionDialog: React.FC<OwnProps> = ({ dimissModal }) => {

    const [segment, setSegment] = useState<string | undefined>("coin")
    const [isPurchase, setIsPurchase] = useState(true)
    const [coin, setCoin] = useState("")
    const [dollarAmount, setDollarAmount] = useState("")
    const [numberOfCoins, setNumberOfCoins] = useState("")

    const user = useSelector((state: any) =>  state.firebase.user)

    const submit = () => {
        if (user !== null && coin !== "") {
            if (segment === "coin" && numberOfCoins !== "") {
                const transation = {numberOfCoins, coin, isPurchase: isPurchase ? "on" : false}
                recordTransaction(transation, user.uid)
                dimissModal()
            } else if (segment === "dollar" && dollarAmount !== "") {
                const transation = {dollarAmount, coin, isPurchase: isPurchase ? "on" : false}
                recordTransaction(transation, user.uid)
                dimissModal()
            }
        }
    }

    return (
        <>
            <IonContent className={"ion-padding"}>

            <h3 className={"new-transaction-title"}>New Transaction</h3>
            <IonSegment value={segment}>
                <IonSegmentButton value="dollar" onClick={() => setSegment("dollar")}>
                    <IonLabel>$ Amount</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="coin" onClick={() => setSegment("coin")}>
                    <IonLabel># of Coins</IonLabel>
                </IonSegmentButton>
            </IonSegment>

                <IonItem>
                    <IonLabel position="stacked" color="primary">Purchase/Sale</IonLabel>
                    <IonToggle checked={!isPurchase} onClick={() => setIsPurchase(!isPurchase)} />
                </IonItem>
                {
                    segment === "dollar" ?
                        <div>
                           <IonItem>
                                <IonLabel position="stacked" color="primary">Coin</IonLabel>
                                <IonInput name="coin" type="text" value={coin} spellCheck={false} autocapitalize="off" onIonChange={e => setCoin(e.detail.value!)}
                                    required>
                                </IonInput>
                            </IonItem>
                            <IonItem>
                                <IonLabel position="stacked" color="primary">$ Amount</IonLabel>
                                <IonInput name="amount" type="text" value={dollarAmount} spellCheck={false} autocapitalize="off" onIonChange={e => setDollarAmount(e.detail.value!)}
                                    required>
                                </IonInput>
                            </IonItem>
                        </div>
                        :
                        <div>
                            <IonItem>
                                <IonLabel position="stacked" color="primary">Coin</IonLabel>
                                <IonInput name="coin" type="text" value={coin} spellCheck={false} autocapitalize="off" onIonChange={e => setCoin(e.detail.value!)}
                                    required>
                                </IonInput>
                            </IonItem>
                            <IonItem>
                                <IonLabel position="stacked" color="primary"># of Coins Amount</IonLabel>
                                <IonInput name="amount" type="text" value={numberOfCoins} spellCheck={false} autocapitalize="off" onIonChange={e => setNumberOfCoins(e.detail.value!)}
                                    required>
                                </IonInput>
                            </IonItem>
                        </div>
                }
                <div className={"new-transaction-buttons"} >
                <IonButton color="primary" onClick={() => submit()}>
                    Submit
                </IonButton>
                <IonButton color="medium" onClick={dimissModal}>
                    Cancel
                </IonButton>
                </div>
            </IonContent>
        </>
    );
};

export default React.memo(NewTransactionDialog)
