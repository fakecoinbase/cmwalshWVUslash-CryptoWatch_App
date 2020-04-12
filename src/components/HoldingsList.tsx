import { useState } from "react";
import Holding from "../models/Holding";
import React from "react";
import { useSelector } from "react-redux";
import { IonList, IonItem, IonAvatar, IonLabel, IonGrid, IonRow, IonCol } from "@ionic/react";
import numbro from "numbro";
import "./HoldingsList.scss"
import { isPlatform } from "@ionic/core";

interface Props {
    total: number
}

const HoldingsList: React.FC<Props> = ({total}) => {

    const [list, setList] = useState([])
    const holdingsList = useSelector((state: any) => state.coinbase.holdingsList)

    const buildList = () => {
        if (isPlatform('ios') || isPlatform('android')) {
            return (
                holdingsList.map((holding: Holding, index: number) => {
                    let icon = require(`cryptocurrency-icons/32/icon/generic.png`); 
                    try {
                        icon = require(`cryptocurrency-icons/32/icon/${holding.ticker.toLowerCase()}.png`); 
                    } catch (ex) {
                        console.log(`Using generic icon for ${holding.ticker}`)
                    }
                    return (
                        <IonItem className="holding-item">
                            <IonAvatar className={"holding-avatar"} slot="start">
                                <img className={"holding-icon"} src={icon}/>
                            </IonAvatar>
                            <IonLabel className={"holding-list-label"}>
                                <div>
                                    {holding.currentPrice.name}
                                </div>
                            </IonLabel>
                            <IonLabel className={"holdings-list-amount"}>
                                <div>
                                    ${numbro(Number(holding.currentPrice.quote.USD.price) * Number(holding.amount)).format({
                                        thousandSeparated: true,
                                        mantissa: 2,
                                    })}
                                </div>
                                <p>{numbro(holding.amount).format({
                                            thousandSeparated: true
                                        })} {holding.ticker}</p>
                            </IonLabel>
                        </IonItem>
                    )
                })
            )
        } else {
            return (
                <IonGrid fixed className="holdings-grid">
                    <IonRow className={"holdings-row"} >
                        { holdingsList.map((holding: Holding, index: number) => {
                            let icon = require(`cryptocurrency-icons/32/icon/generic.png`); 
                            try {
                                icon = require(`cryptocurrency-icons/32/icon/${holding.ticker.toLowerCase()}.png`); 
                            } catch (ex) {
                                console.log(`Using generic icon for ${holding.ticker}`)
                            }
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
                    </IonRow>
                </IonGrid>
            )
        }
    }
    
    // const list = holdingsList.map((holding: Holding) => <div>Test</div>)
    return (
        <IonList className={"ion-padding default-background"}>
            {buildList()}
        </IonList>
    )
}

export default HoldingsList