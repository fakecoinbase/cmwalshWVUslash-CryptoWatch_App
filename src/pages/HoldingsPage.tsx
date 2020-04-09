import { RouteComponentProps } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import React, { useEffect, useState } from "react";
import { IonPage, IonContent, IonHeader, IonTitle, IonToolbar, getConfig, IonFab, IonFabButton, IonIcon, IonModal, IonButton, IonButtons, IonCard, IonCardTitle } from "@ionic/react";
import { getDailyHoldingsHistory, getCoinbaseHoldings, getAdditionalHoldings, getTopCryptos, signout } from "../firebase/firebase";
import numbro from "numbro";
import { setHoldingsHistory, setUserState } from "../store/actions/firebaseActions";
import Holding from "../models/Holding";
import { setCoinbaseHoldings, setAdditionalHoldings, setHoldingsMap, setLoadingHoldings, setHoldingsList } from "../store/actions/coinbaseActions";
import { updateCurrentPrices } from "../store/actions/currentPricesActions";
import HoldingsChart from "../components/HoldingsChart";
import HoldingsHistoryChart from "../components/HoldingsHistoryChart";
import moment from 'moment'
import { isPlatform } from "@ionic/core";
import { add, logOut } from "ionicons/icons";
import NewTransactionDialog from "../components/NewTransactionDialog";
import HoldingsList from "../components/HoldingsList";
import "./HoldingsPage.scss"
 
interface OwnProps extends RouteComponentProps {}

const HoldingsPage: React.FC<OwnProps> = ({ history }) => {
    
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
        if (user) {
            dispatch(setLoadingHoldings(true))
            getTopCryptos().then((resp) => {
                dispatch(updateCurrentPrices(resp));
            }).catch(err => console.log(err));
            getDailyHoldingsHistory(user.uid).then((resp: any) => {
                dispatch(setHoldingsHistory(resp))
            })
            getCoinbaseHoldings(user.uid).then((resp:any) => {
                dispatch(setCoinbaseHoldings(resp))
            })
            getAdditionalHoldings(user.uid).then((resp:any) => {
                dispatch(setAdditionalHoldings(resp))
            })
            dispatch(setLoadingHoldings(false))
        } else {
            history.push("/landing")
        }
    }, []);

    useEffect(() => {
        if (user) {

        }
    }, [currentPrices]);

    const logOut = () => {
        signout().then(() =>  {
            dispatch(setUserState(null))
            history.push("/landing")
        })
    }

    const calculateTotalHoldings = () => {
        const holdingsList:any = []
        if (currentPrices !== undefined && ((additionalHoldings !== undefined && additionalHoldings.length > 0) || (cbHoldings && cbHoldings.length > 0))) {
            if (cbHoldings && currentPrices.length > 0) {
                cbHoldings.forEach((coin : any) => {
                    if (coin.amount > 0) {
                    var currentPrice = currentPrices.find((x:any) => x.symbol === coin.currency);
                    holdingsList.push(new Holding(coin.currency, Number(coin.amount), currentPrice))
                    cbHoldings[coin.currency] = Number(coin.amount)
                }
                });
            }
            additionalHoldings.forEach((coin:any) => {
                const existingHolding = holdingsList.find((x:any) => x.ticker === coin.coin)
                if (existingHolding !== undefined) {
                existingHolding.amount +=  Number(coin.numberOfCoins)
                } else {
                var currentPrice = currentPrices.find((x:any) => x.symbol === coin.coin);
                holdingsList.push(new Holding(coin.coin, Number(coin.numberOfCoins), currentPrice))
                }
            });
            let mapping:any = [];
            mapping.options = holdingsMappingoptions;
            mapping.series = [];
            mapping.options.labels = [];

            holdingsList.forEach((holding: any) => {
                try {
                var total = Number(holding.amount) * holding.currentPrice.quote.USD.price;
                mapping.series.push(Number(total.toFixed(2)));
                mapping.options.labels.push(holding.ticker)
                } catch {
                    console.log(`Error with  holdings: ${holding.ticker}`)
                }
            })
            dispatch(setHoldingsMap(mapping))
            dispatch(setHoldingsList(holdingsList))
        }


        console.log(holdingsList)
        var total = 0 
        for (let i = 0; i < holdingsList.length; i ++) {
            let asset = holdingsList[i]
            if (asset.currentPrice !== undefined) {
                total += Number(parseFloat(asset.amount)) * Number(asset.currentPrice.quote.USD.price);
            }
        }
        return total
    }

    const holdingsMappingoptions = {
        chart: {
          width: 380,
          type: 'pie',
        },
        fill: {
          type: 'gradient',
        },
        dataLabels: {
          enabled: true,
          style: {
              fontSize: '16px',
          }
        },
        legend: {
          position: 'bottom',
          fontSize: '17px',
            labels: {
                colors: ["#FFFFFF"],
            }
        },
        tooltip: {
          enabled: true,
          style: {
            fontSize: '16px',
          },
          y: {
            formatter: function(val: any) {
              return "$" + val
            }
          }
        },
        responsive: [{
          breakpoint: 480,
          options: {
            // chart: {
            //   width: 200
            // },
            legend: {
              position: 'bottom'
            }
          }
        }]
    };
        
    const options = () => { 
        return {
            chart: {
                type: 'area',
                toolbar: { tools: { download: false } },
                zoom: {
                    enabled: false
                },
                animations: {
                    enabled: false,
                },
                menu: {
                    show: false
                }
            },
            grid: {
                show: false,
            },
            legend: { 
                labels: {
                    color: "#000000",
                }
            },
            tooltip: {
                x: {
                    formatter: function (value: any) {
                        return new Date(value).toLocaleString()
                    }
                },
                y: {
                    formatter: function (value: any) {
                        if (value < .5) {
                            return "$" + numbro(value).format({
                                mantissa: 4,
                            })                        }
                        return "$" + numbro(value).format({
                            thousandSeparated: true,
                            mantissa: 2,
                        })
                    }
                },
            },
            dataLabels: {
              enabled: false
            },
            stroke: {
              curve: 'smooth',
              width: 3
            },
            yaxis: {
                opposite: true,
                labels: {
                    style: {
                        colors: '#2E93fA'
                    },
                    align: 'right',
                    show: true,
                    formatter: function (value: any) {
                        if (value < .5) {
                            return "$" + numbro(value).format({
                                average: true,
                                mantissa: 4,
                            })                        }
                        return "$" + numbro(value).format({
                            average: true,
                            mantissa: 2,
                        })
                    }
                },
                tooltip: {
                    enabled: true,
                }
            },
            xaxis: {
                labels: {
                    style: {
                        colors: '#C0C0C0'
                    },
                    formatter: function (value: any) {
                        return moment(value).format('l hh:mm a')
                    }
                },
                type: 'datetime',
                tooltip: {
                    enabled: true
                }
            },
          }
    }

    const series = () => {
        let priceData = []
        if(holdingsHistory === undefined && holdingsHistory.length ) {
            let data = [{
                x: new Date(0),
                y: [0, 0, 0, 0]
            },
            {
                x: new Date(1),
                y: [0,0,0,0]
            }
            ]
            priceData.push({data});
        }
        else {
            let data: any = [];
            try {
                holdingsHistory.forEach((record: any) => {
                    var obj: any = {};
                    obj.x = new Date(record.lastUpdated.seconds * 1000).toLocaleString();
                    obj.y = [record.totalHoldings];
                    data.push(obj);               
                });
                priceData.push({data});
            } catch {
                let data = [{
                    x: new Date(0),
                    y: [0, 0, 0, 0]
                },
                {
                    x: new Date(1),
                    y: [0,0,0,0]
                }
                ]
                priceData.push({data});
            }
        }
        return priceData
    }   
    return (
        <IonPage id="landing-page">
            <IonHeader >
                <IonToolbar>
                    <IonTitle>Holdings</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={() => logOut()}>Log Out</IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent className={"ion-padding"}>
                <IonCard className={"total-holdings ion-padding"}>
                <IonCardTitle className="total-title">
                    Current Holdings: ${numbro(calculateTotalHoldings()).format({
                                thousandSeparated: true,
                                mantissa: 2,
                            })}
                </IonCardTitle>
                    <div className={"last-updated-time"}>Last Updated: {lastUpdated.format("llll")}</div>
                </IonCard>
                <HoldingsList total={calculateTotalHoldings()} />
                <div className={isPlatform('ios') || isPlatform('android') ? "" : "flex"}>
                    <HoldingsHistoryChart total={calculateTotalHoldings()} 
                        series={series()[0].data} 
                        options={options()} />
                    <HoldingsChart/>
                </div>
            </IonContent>
            <IonModal
                isOpen={showTransactionModal}
                onDidDismiss={() => setShowTransactionModal(false)}
            >
               <NewTransactionDialog dimissModal={() => setShowTransactionModal(false)}/>
            </IonModal>
            <IonFab slot="fixed" vertical="bottom" horizontal="end">
                <IonFabButton onClick={() => setShowTransactionModal(true)}>  
                    <IonIcon icon={add} />
                </IonFabButton>
            </IonFab>
        </IonPage>
    );
  };

  export default HoldingsPage;
