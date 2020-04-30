import { RouteComponentProps, withRouter } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import React, { useEffect, useState } from "react";
import { IonPage, IonContent, IonHeader, IonTitle, IonToolbar, IonFab, IonFabButton, IonIcon, IonModal, IonButton, IonButtons, IonCard, IonCardTitle, IonRefresher, IonRefresherContent, IonMenuButton, IonSegment, IonSegmentButton } from "@ionic/react";
import { getDailyHoldingsHistory, getCoinbaseHoldings, getAdditionalHoldings, getTopCryptos, updateCoinbaseHolding, firebaseClient } from "../firebase/firebase";
import numbro from "numbro";
import { setHoldingsHistory } from "../store/actions/firebaseActions";
import Holding from "../models/Holding";
import { setCoinbaseHoldings, setAdditionalHoldings, setHoldingsMap, setLoadingHoldings, setHoldingsList, setCoinbaseAuth, setAccessToken, setSigningIn } from "../store/actions/coinbaseActions";
import { updateCurrentPrices } from "../store/actions/currentPricesActions";
import HoldingsChart from "../components/HoldingsChart";
import HoldingsHistoryChart from "../components/HoldingsHistoryChart";
import moment from 'moment'
import { isPlatform, RefresherEventDetail } from "@ionic/core";
import { add } from "ionicons/icons";
import NewTransactionDialog from "../components/NewTransactionDialog";
import HoldingsList from "../components/HoldingsList";
import "./HoldingsPage.scss"
import axios from "axios";
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { toast } from "../components/toast";

interface OwnProps extends RouteComponentProps {
    urlProps: any
}

const HoldingsPage: React.FC<OwnProps> = ({ urlProps, history }) => {
    
    const [showTransactionModal, setShowTransactionModal] = useState(false)
    const [segment, setSegment] = useState<"list" | "charts">("list")
    const [loadingWallets, setLoadingWallets] = useState(false)
    const [wallets, setWallets] = useState([])

    const holdingsHistory = useSelector((state: any) => state.firebase.holdingsHistory)
    const currentPrices = useSelector((state: any) => state.prices.currentPrices)
    const cbHoldings = useSelector((state: any) => state.coinbase.cbHoldings)
    const additionalHoldings = useSelector((state: any) => state.coinbase.additionalHoldings)
    const lastUpdated = useSelector((state: any) => state.coinbase.lastUpdated)
    const useDarkMode = useSelector((state: any) => state.user.useDarkMode)
    const accessToken = useSelector((state: any) => state.coinbase.accessToken)
    const signingIn = useSelector((state: any) => state.coinbase.signingIn)

    const dispatch = useDispatch()
    const user = useSelector((state: any) => state.firebase.user)
    if (!user) {
        history.push("/landing")
    }
    useEffect(() => {
        if (user) {
            dispatch(setLoadingHoldings(true))
            getCoinbaseHoldings(user.uid).then((resp:any) => {
                dispatch(setCoinbaseHoldings(resp))
            })
            getAdditionalHoldings(user.uid).then((resp:any) => {
                dispatch(setAdditionalHoldings(resp))
            })
            getDailyHoldingsHistory(user.uid).then((resp: any) => {
                dispatch(setHoldingsHistory(resp))
            })
            const cbHoldings = firebaseClient.firestore().collection('cbHoldings').doc(user.uid).collection("cbHoldings")
            cbHoldings.onSnapshot(querySnapshot => {
                const holdings:any[] = []
                querySnapshot.docs.forEach(doc => {
                    const data = doc.data().holding
                    if (Number(data.amount) > 0) {
                        holdings.push(data)
                    }
                });
                dispatch(setCoinbaseHoldings(holdings))
            }, err => {
                console.log(`Encountered error: ${err}`);
            });
            const additionalHoldings = firebaseClient.firestore().collection('holdings').doc(user.uid).collection("holdings")
            additionalHoldings.onSnapshot(querySnapshot => {
                const holdings:any[] = []
                querySnapshot.docs.forEach(doc => {
                    holdings.push(doc.data())
                });
                dispatch(setAdditionalHoldings(holdings))
            }, err => {
                console.log(`Encountered error: ${err}`);
            });
            const holdingsHistoryCollection = firebaseClient.firestore().collection('dailyHoldings').doc(user.uid).collection("holdingsHistory")
            holdingsHistoryCollection.onSnapshot(querySnapshot => {
                let history = holdingsHistory
                querySnapshot.docChanges().forEach(change => {
                    history.push(change.doc.data())
                });
                dispatch(setHoldingsHistory(history))
            }, err => {
                console.log(`Encountered error: ${err}`);
            });
            dispatch(setLoadingHoldings(false))
        } else {
            history.push("/landing")
        }
    }, []);

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
    }, [wallets]);

    useEffect(() => {
        if (!user) {
            history.push("/landing")
        }
    }, [user])
    
    useEffect(() => {
        if (user) {
            getDailyHoldingsHistory(user.uid).then((resp: any) => {
                dispatch(setHoldingsHistory(resp))
            })
            getCoinbaseHoldings(user.uid).then((resp:any) => {
                dispatch(setCoinbaseHoldings(resp))
            })
            getAdditionalHoldings(user.uid).then((resp:any) => {
                dispatch(setAdditionalHoldings(resp))
            })
        } else {
            history.push("/landing")
        }
    }, [currentPrices]);

    useEffect(() => {
        if (urlProps) {
            console.log(urlProps)
            coinbaseAuth(urlProps.replace('?code=',''))
            history.push('/holdings')
        }
    }, [urlProps]);

    const coinbaseAuth = async (code:any) => {
        console.log(code)
        dispatch(setSigningIn(true))
        const response =  await axios.get(`https://mighty-dawn-74394.herokuapp.com/token?code=${code}`)
        dispatch(setCoinbaseAuth(response.data !== null))
        dispatch(setAccessToken(response.data))
        dispatch(setSigningIn(false))
        toast("Successfully Authenticated with Coinbase")
    }

    const getWallets = () => {
        if (user && accessToken) {
            // const headers = {'Authorization': 'Bearer ' + accessToken }
            setLoadingWallets(true)
            axios.get(`https://mighty-dawn-74394.herokuapp.com/wallets?code=${accessToken}`)
            .then(response => {
                setLoadingWallets(false)
                setWallets(response.data)
                for (let i = 0; i < response.data.length; i++) {
                    updateCoinbaseHolding(response.data[i].balance, user.uid)
                }
            })
            .catch(error => {
                console.log(error);
            });
        }
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
                colors: useDarkMode ? ["#FFFFFF"] : ["#000000"],
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
            colors: ['#3498DB'],
            grid: {
                show: false,
            },
            legend: {
                show: false,
                floating: true,
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
                        colors: useDarkMode ? '#3498DB' : '#3498DB'
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
                        
                        colors: useDarkMode ? '#C0C0C0' : '#000000'
                    },
                    formatter: function (value: any) {
                        return moment(value).format('LT')
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

    function refresh(event: CustomEvent<RefresherEventDetail>) {
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
            event.detail.complete()
        } else {
            event.detail.complete()
        }
    }
 
    function coinbaseLogin() {
        if (isPlatform('ios') || isPlatform('android')) {
            window.location.href ='https://us-central1-crypto-watch-dbf71.cloudfunctions.net/redirectHodl'
        } else {
            var browserRef = InAppBrowser.create("https://us-central1-crypto-watch-dbf71.cloudfunctions.net/redirectHodl", "_blank", "location=no,clearsessioncache=yes,clearcache=yes");
            let loadStart = browserRef.on('loadstart')
            if (loadStart) {
                loadStart.subscribe((event) => {
                    console.log(event.url)
                    if ((event.url).indexOf("authorize/") !== -1 && (event.url.indexOf("authorize/oauth_signin") === -1)) {
                        console.log("found correct URL")
                        browserRef.on("exit").subscribe((event) => {});
                        browserRef.close();
                        var authCode = event.url.split("authorize/")[1];
                        console.log("auth code: " + authCode)
                        // var parsedResponse:any = {};
                        // for (var i = 0; i < authCode.length; i++) {
                        //     parsedResponse[responseParameters[i].split("=")[0]] = responseParameters[i].split("=")[1];
                        // }
                        // if (parsedResponse["access_token"] !== undefined && parsedResponse["access_token"] !== null) {
                        coinbaseAuth(authCode)             
                    }
                });
            }
        } 
        // browserRef.on("exit").subscribe((event) => {
        //     toast("The Coinbase sign in flow was canceled");
        // });
        // browserRef.addEventListener("loadstart", (event) => {
        //     if ((event.url).indexOf("http://localhost/callback") === 0) {
        //         browserRef.removeEventListener("exit", (event) => {});
        //         browserRef.close();
        //         var responseParameters = ((event.url).split("#")[1]).split("&");
        //         var parsedResponse = {};
        //         for (var i = 0; i < responseParameters.length; i++) {
        //             parsedResponse[responseParameters[i].split("=")[0]] = responseParameters[i].split("=")[1];
        //         }
        //         if (parsedResponse["access_token"] !== undefined && parsedResponse["access_token"] !== null) {
        //             resolve(parsedResponse);
        //         } else {
        //             reject("Problem authenticating with Facebook");
        //         }
        //     }
        // });
        // browserRef.addEventListener("exit", function(event) {
        //     reject("The Facebook sign in flow was canceled");
        // });
    }

    if (!user) {
        history.push("/landing")
    }
    return (
        <IonPage id="landing-page">
            {isPlatform("mobile") ? 
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>Holdings</IonTitle>
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
            <IonContent className={"ion-padding"}>
                <IonRefresher slot="fixed" onIonRefresh={refresh}>
                    <IonRefresherContent></IonRefresherContent>
                </IonRefresher>
                <IonCard className={"total-holdings ion-padding"}>
                    <IonCardTitle className="total-title">
                        Current Holdings: ${numbro(calculateTotalHoldings()).format({
                                    thousandSeparated: true,
                                    mantissa: 2,
                                })}
                    </IonCardTitle>
                    <div className={"last-updated-time"}>
                        Last Updated: {lastUpdated.format("llll")}
                    </div>
                    { accessToken ?
                        <IonButton className={"coinbase-button"} size="small" onClick={() => getWallets()}>
                            Sync Wallets
                        </IonButton>
                    : signingIn ?
                        <IonButton className={"coinbase-button"} size="small">
                            Signing In...
                        </IonButton>
                    :
                        <IonButton className={"coinbase-button"} size="small" onClick={() => coinbaseLogin()}>
                            Sign In With Coinbase
                        </IonButton>
                    }
                    
                </IonCard>
                {isPlatform("mobile") ?
                    <IonSegment className={"holdings-segment"} value={segment} onIonChange={(e) => setSegment(e.detail.value as any)}>
                        <IonSegmentButton value="list" >
                            List
                        </IonSegmentButton>
                        <IonSegmentButton value="charts" >
                            Charts
                        </IonSegmentButton>
                    </IonSegment>
                    : null
                }
                {!isPlatform("mobile") ?
                    <>
                        <HoldingsList total={calculateTotalHoldings()} />
                        <div className={isPlatform('mobile') ? "" : "holdings-charts flex"}>
                            <HoldingsHistoryChart total={calculateTotalHoldings()}
                                series={series()[0].data}
                                options={options()} />
                            <HoldingsChart/>
                        </div>
                    </>
                    :
                    segment === "list" ?
                    <HoldingsList total={calculateTotalHoldings()} />
                    :
                    <div className={isPlatform('mobile') ? "" : "flex"}>
                        <HoldingsHistoryChart total={calculateTotalHoldings()}
                            series={series()[0].data}
                            options={options()} />
                        <HoldingsChart/>
                    </div>
                }
            </IonContent>
            <IonModal
                isOpen={showTransactionModal}
                onDidDismiss={() => setShowTransactionModal(false)}
            >
               <NewTransactionDialog dimissModal={() => setShowTransactionModal(false)}/>
            </IonModal>
            <IonFab slot="fixed" vertical="bottom" horizontal="end">
                <IonFabButton onClick={() => setShowTransactionModal(true)}>  
                    <IonIcon className={"black-text"} icon={add} />
                </IonFabButton>
            </IonFab>
        </IonPage>
    );
  };

  export default withRouter(HoldingsPage);
