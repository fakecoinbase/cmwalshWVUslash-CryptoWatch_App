import React, { Component, useState, useEffect } from 'react';
import moment from 'moment';
import Pusher from 'pusher-js';
import Ticker from './Ticker';
import { IonSegment, IonSegmentButton, IonHeader, IonCard, IonCardContent, IonToolbar, IonTitle, IonContent, IonPage, IonButtons, IonMenuButton, IonList, IonGrid, IonRow, IonCol, IonButton } from '@ionic/react';
import { useSelector } from 'react-redux';

interface OwnProps {
    filteredTickerList: any[]
 };


const TickerList: React.FC<OwnProps> = ({ filteredTickerList }) => {
    const [segment, setSegment] = useState<'list' | 'cards'>('cards');
    const [data, setData] = useState([]);
    const [tickers, setTickers] = useState<any>([]);

    const currentPrices: any[] = useSelector((state:any) => state.prices.currentPrices)
    const lastUpdated = useSelector((state: any) => state.prices.lastUpdated)
    useEffect(() => {
    
        var tickerData = currentPrices == null ? data : currentPrices.filter((coin: any) => coin.cmc_rank <= 20);
        
        console.log(filteredTickerList)
        const t = tickerData.map((currency: any, index: number) => {
            if(filteredTickerList.indexOf(currency.symbol) > -1) {
                return (
                    <IonCol className={"ticker-col"} size="12" size-md="4" key={index}>
                        <Ticker id={index} ticker={currency.symbol} crypto={currency} />
                    </IonCol>
                )
            }
      })
      setTickers(t)
    }, []);

    useEffect(() => {
        var tickerData = currentPrices == null ? data : currentPrices;
    
        if (segment === 'cards') {
            const t = tickerData.map((currency: any, index: number) => {
                if (segment === 'cards') {
                    if (filteredTickerList.indexOf(currency.symbol) > -1) {
                        return (
                            <IonCol className={"ticker-col"} size="12" size-md="3" key={index}>
                                <Ticker id={index} ticker={currency.symbol} crypto={currency} />
                            </IonCol>
                        )
                    }
                }
            })
            setTickers(t) 
        } else {
            const t =
                <IonCol size="12" size-md="3" key={1}>
                    Coming Soon!
                </IonCol>
            setTickers(t)
        }   
    }, [segment, currentPrices, filteredTickerList]);

    return (
        <IonContent className="tickers">
            <IonSegment value={segment} onIonChange={(e) => setSegment(e.detail.value as any)}>
                <IonSegmentButton value="list" >
                List
                </IonSegmentButton>
                <IonSegmentButton value="cards" >
                Cards
                </IonSegmentButton>
            </IonSegment>
            <IonList className={"default-background"}>
            <div className={"last-updated-time"}>Last Updated: {lastUpdated.format("llll")}</div>
                <IonGrid fixed className={"ticker-grid"}>
                <IonRow align-items-stretch>
                    {currentPrices == null ? noData : tickers}
                </IonRow>
                </IonGrid>
            </IonList>
        </IonContent>
    );
}


const noData = (
    <div className="dashboard-section section">
		<div className="rounded-card card z-depth-0">
			<div className="card-content">
				<span >Loading Ticker Data... </span>
			</div>
		</div>
	</div>
);

export default React.memo(TickerList)