import { useState, useEffect } from "react";
import Holding from "../models/Holding";
import React from "react";
import { useSelector } from "react-redux";
import { IonCard, IonCardTitle, IonCardContent, IonList, IonItem, IonAvatar, IonLabel, IonNote, IonGrid, IonRow, IonCol } from "@ionic/react";
import numbro from "numbro";
import "./HoldingsList.scss"

interface Props {
    total: number
}

const HoldingsList: React.FC<Props> = ({total}) => {

    const [list, setList] = useState([])
    const holdingsList = useSelector((state: any) => state.coinbase.holdingsList)

    const buildList = () => {
        return holdingsList.map((holding: Holding, index: number) => {
            let icon = require(`cryptocurrency-icons/32/icon/generic.png`); 
            try {
                icon = require(`cryptocurrency-icons/32/icon/${holding.ticker.toLowerCase()}.png`); 
            } catch (ex) {
                console.log(`Using generic icon for ${holding.ticker}`)
            }
            console.log(holding)
            return (
                <IonCol className="holding-col" size="6" size-md="2" key={index}>
                <IonItem className="holding-card">
                    <IonAvatar className={"holding-avatar"} slot="start">
                        <img className={"holding-icon"} src={icon}/>
                    </IonAvatar>

                    <IonLabel className={"holding-label"}>
                        <div>
                            {/* <img className={"icon"} src={icon}/> */}
                            {holding.ticker}
                        </div>
                        <div>
                            ${numbro(Number(holding.currentPrice.quote.USD.price) * Number(holding.amount)).format({
                                thousandSeparated: true,
                                mantissa: 2,
                            })}
                        </div>
                        <h3>Cur: ${numbro(holding.currentPrice.quote.USD.price).format({
                            thousandSeparated: true,
                            mantissa: 2,
                        })}</h3>
                        <p>AMT: {holding.amount} </p>
                    </IonLabel>
                </IonItem>
                </IonCol>
            )
        })
    }
    
    // const list = holdingsList.map((holding: Holding) => <div>Test</div>)
    return (
        // <IonCard className={"holdings-list ion-padding"}>
        //     <IonCardTitle>
        //         Current Holdings: ${numbro(total).format({
        //                     thousandSeparated: true,
        //                     mantissa: 2,
        //                 })}
        //     </IonCardTitle>
        //     <IonCardContent >
        //         <IonList>
        //             {buildList()}
        //         </IonList>
        //     </IonCardContent>
        // </IonCard>

        // <IonCard className={"holdings-list ion-padding"}>
        //     <IonCardTitle>
        //         Current Holdings: ${numbro(total).format({
        //                     thousandSeparated: true,
        //                     mantissa: 2,
        //                 })}
        //     </IonCardTitle>
            <IonList className={"default-background"}>
                <IonGrid fixed className="holdings-grid">
                    <IonRow className={"holdings-row"} >
                        {buildList()}
                    </IonRow>
                </IonGrid>
            </IonList>
        // </IonCard>
    )
}

export default HoldingsList