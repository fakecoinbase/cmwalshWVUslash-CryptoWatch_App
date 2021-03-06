import React, { useState, useEffect } from 'react';
import Ticker from './Ticker';
import { IonSegment, IonSegmentButton, IonContent, IonList, IonGrid, IonRow, IonCol, IonItem, IonLabel, isPlatform } from '@ionic/react';
import { useSelector } from 'react-redux';
import './ticker.scss'

interface OwnProps {
    filteredTickerList: any[]
 };


const TickerList: React.FC<OwnProps> = ({ filteredTickerList }) => {
    const [segment, setSegment] = useState<'list' | 'cards'>(isPlatform("mobile") ? 'list' : 'cards');
    const data:any[] = [];
    const [tickers, setTickers] = useState<any>([]);

    const currentPrices: any[] = useSelector((state:any) => state.prices.currentPrices)
    const lastUpdated = useSelector((state: any) => state.prices.lastUpdated)
    useEffect(() => {
        var tickerData = currentPrices == null ? data : currentPrices.filter((coin: any) => coin.cmc_rank <= 20);
        // console.log(filteredTickerList)
        const t = tickerData.map((currency: any, index: number) => {
            if(filteredTickerList.indexOf(currency.symbol) > -1) {
                return (
                    <IonCol className={"ticker-col"} size="12" size-md="4" key={index}>
                        <Ticker useCards={true} id={index} ticker={currency.symbol} crypto={currency} />
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
                if (filteredTickerList.indexOf(currency.symbol) > -1) {
                    return (
                        <IonCol className={"ticker-col"} size="12" size-md="4" key={index}>
                            <Ticker useCards={true} id={index} ticker={currency.symbol} crypto={currency} />
                        </IonCol>
                    )
                }
            })
            setTickers(t) 
        } else {
            const t = tickerData.map((currency: any, index: number) => {
                if (filteredTickerList.indexOf(currency.symbol) > -1) {
                    return (
                        <Ticker useCards={false} key={index} id={index} ticker={currency.symbol} crypto={currency} />
                    )
                }
            })
            setTickers(t)
        }   
    }, [segment, currentPrices, filteredTickerList]);

    return (
        <IonContent className="ion-padding tickers">
            <IonSegment value={segment} onIonChange={(e) => setSegment(e.detail.value as any)}>
                <IonSegmentButton value="list" >
                    List
                </IonSegmentButton>
                <IonSegmentButton value="cards" >
                    Cards
                </IonSegmentButton>
            </IonSegment>
            <div className={"last-updated-time"}>Last Updated: {lastUpdated.format("llll")}</div>
            <IonList className={isPlatform("mobile") || segment === "cards" ? "default-background" : "desktop-ticker-list default-background"}>
                { segment === 'cards' ? 
                    <IonGrid fixed className={"ticker-grid"}>
                        <IonRow align-items-stretch>
                            {currentPrices === null ? noData : tickers}
                        </IonRow>
                    </IonGrid>
                :
                <>
                    <IonItem className="holding-item headers">
                        <IonLabel className={"ticker-list-label"}>
                            Name
                        </IonLabel>
                        <IonLabel className={"ticker-item-chart-title"}>
                            1 Day Chart
                        </IonLabel>
                        <IonLabel className={"ticker-item-price"}>
                            Price
                        </IonLabel>
                    </IonItem>
                    {currentPrices === null ? noData : tickers}
                </>
            }
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