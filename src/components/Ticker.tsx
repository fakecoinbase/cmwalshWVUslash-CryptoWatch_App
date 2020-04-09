import React, { useState, useEffect } from 'react'
import '../theme/card.scss';
import moment from 'moment';
import { IonCard, IonCardHeader, IonItem, IonCardContent, IonCardTitle, IonRow, IonCol, IonButton, IonIcon } from '@ionic/react';
import { logoTwitter, arrowDown, arrowUp } from 'ionicons/icons';
import numbro from 'numbro'
import ClipLoader from "react-spinners/ClipLoader";
import { css } from "@emotion/core";
import Chart from 'react-apexcharts';
import { getHistoricalCyrptoPrices } from '../firebase/firebase';
import { useDispatch, useSelector } from 'react-redux';
import { updateGraphData } from '../store/actions/graphActions';

interface TickerProps { 
    crypto: any;
    id: any;
    ticker: string;
}

const Ticker: React.FC<TickerProps> = ({ ticker, crypto, id }) => {
    const [priceData, setPriceData] = useState([])
    const [dataPoints, setDataPoints] = useState()
    const [chartOpen, setChartOpen] = useState(true)

    const prices = useSelector((state: any) => state.graphData[ticker])
    const dispatch = useDispatch()

    useEffect(() => {
        getHistoricalCyrptoPrices(ticker).then((resp: any) => {
            dispatch(updateGraphData(resp, ticker))
        })
      }, []);

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    })

    let icon = require(`cryptocurrency-icons/32/icon/generic.png`); 
    try {
        icon = require(`cryptocurrency-icons/32/icon/${crypto.symbol.toLowerCase()}.png`); 
        // do stuff
    } catch (ex) {
        console.log(`Using generic icon for ${crypto.symbol}`)
    }

    const options = () => { 
        return {
            chart: {
                type: 'line',
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
                      
            // colors: ['#909090'],
            // colors: [function(props: any) {
            //     console.log(props.w.config.series[0].data)
            //     console.log(props.w.config.series[0].data[props.w.config.series[0].data.length-1])
            //     if (props.w.config.series[0].data[props.w.config.series[0].data.length-1].y[0] > props.w.config.series[0].data[0].y[0]) {
            //         return '#009e74'
            //     } else {
            //         return '#d94040'
            //     }
            //   }],
            // D63230
            grid: {
                show: false,
            },
            tooltip: {
                x: {
                    show: false,
                },
                y: {
                    show: false
                    
                },
            },
            legend: {
                show: false,
                floating: true
            },
            dataLabels: {
              enabled: false
            },
            stroke: {
              curve: 'smooth',  
              width: 3
            },
            yaxis: {
                floating:true,
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
                floating:true,
                labels: {
                    show: false,
                    formatter: function (value: any) {
                        return new Date(value).toLocaleString()
                    }
                },
                type: 'datetime',
                tooltip: {
                    enabled: true
                }
            },
          }
    }

    const setPoints = () => {
        let points = []
        if(prices !== undefined && prices.Data !== undefined) {

            let highest = {
                x: new Date(prices.Data[0].time * 1000).toLocaleString(),
                y: prices.Data[0].close,
                marker: {
                    size: 8,
                    fillColor: '#fff',
                    strokeColor: 'red',
                    radius: 2,
                    cssClass: 'apexcharts-custom-class'
                    },
                    label: {
                    borderColor: '#FF4560',
                    offsetY: 0,
                    style: {
                        color: '#fff',
                        background: '#FF4560',
                    },
                    text: 'Point Annotation',
                }
            }
            let lowest = {
                x: new Date(prices.Data[0].time * 1000).toLocaleString(),
                y: prices.Data[0].close,
                marker: {
                    size: 8,
                    fillColor: '#fff',
                    strokeColor: 'red',
                    radius: 2,
                    cssClass: 'apexcharts-custom-class'
                },
                label: {
                    borderColor: '#FF4560',
                    offsetY: 0,
                    style: {
                        color: '#fff',
                        background: '#FF4560',
                    },
                    text: 'Point Annotation',
                }
            }
            prices.Data.forEach((record: any) => {
                if (record.close > highest.y) {
                    highest = {
                            x: new Date(record.time * 1000).toLocaleString(),
                            y: record.close,
                            marker: {
                            size: 8,
                            fillColor: '#fff',
                            strokeColor: 'red',
                            radius: 2,
                            cssClass: 'apexcharts-custom-class'
                        },
                        label: {
                            borderColor: '#FF4560',
                            offsetY: 0,
                            style: {
                                color: '#fff',
                                background: '#FF4560',
                            },
                            text: record.close,
                        }
                    }
                }
                if (record.close < lowest.y) {
                    lowest = {
                            x: new Date(record.time * 1000).toLocaleString(),
                            y: record.close,
                            marker: {
                            size: 8,
                            fillColor: '#fff',
                            strokeColor: 'red',
                            radius: 2,
                            cssClass: 'apexcharts-custom-class'
                        },
                        label: {
                            borderColor: '#FF4560',
                            offsetY: 0,
                            style: {
                                color: '#fff',
                                background: '#FF4560',
                            },
                            text: record.close,
                        }
                    }
                }
            });
            points.push(highest, lowest)
        }
        return points
    }

    const series = () => {
        let priceData = []
        if(prices === undefined || prices.length === 0) {
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
            // console.log(`foreach ${prices.Data}`)
            try {
                prices.forEach((record: any) => {
                    var obj: any = {};
                    obj.x = new Date(record.price.time * 1000).toLocaleString();
                    obj.y = [record.price.close];
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
        // console.log(priceData)
        return priceData
    }   
  
    const override = css`
        display: block;
        margin: 25px auto;
        size: 5px;
        width: 60px;
        height: 60px;
        border-color: red;
    `;
    const s = series()
  return (
    <IonCard className="ticker">
        <IonCardContent className="ticker-card-content grey-text text-darken-3">
            <IonCardTitle className={"ticker-name"} >
                <img className={"icon"} src={icon}/> {crypto.name} 
                {/* <div className={"trading-pair"} > 
                    ({crypto.symbol}/USD)
                </div> */}
                {/* <div className={"trading-pair"} > 
                    Rank: {crypto.rank}
                </div> */}
                <div className={"priceFlex"}>
                <div className={"price"} > 
                    ${numbro(crypto.quote.USD.price).format({
                            average: true,
                            mantissa: 2,
                        })}
                </div>
                <div className={"priceChange"}>
                    (<div className={`${crypto.quote.USD.percent_change_24h >= 0 ? "positive" : "negative"}`}> {numbro(crypto.quote.USD.percent_change_24h).format({
                            average: true,
                            mantissa: 2,
                        })}%</div>)
                </div>

                </div>
                {/* {chartOpen ? <ExpandMore className={"ticker-collapse"} onClick={() => setChartOpen(false)}/>
                            : <ExpandLess className={"ticker-collapse"} onClick={() => setChartOpen(true)} />
                        } */}
                {/* <div className={"ticker-rank"}>Rank: {crypto.rank}</div> */}
            </IonCardTitle>
            <IonCardContent className="chart-content">
            { chartOpen ? 
                <div className="chart">
                    { prices === undefined || prices.length < 1 ?  
                        <ClipLoader
                            css={override}
                            size={150}
                            //size={"150px"} this also works
                            color={"#339989"}
                            loading={true}
                        />
                        :
                        <Chart height={150} options={options()} type="line" 
                            series={[{
                                data: series()[0].data,
                                name: ticker
                            }]} />
                    }
                </div>
            : null }
            </IonCardContent>
            <IonRow justify-content-center>
                <IonCol text-center >
                    <IonRow className={"ticker-row"}>
                        Market Cap
                    </IonRow>
                    <IonRow text-center className={"ticker-row-value"} >
                        {/* { formatter.format(crypto.crypto.market_cap_usd)} */}
                        ${ numbro(crypto.quote.USD.market_cap).format({
                            average: true,
                            mantissa: 2,
                        })}

                    </IonRow>
                </IonCol>
                <IonCol text-center >
                    <IonRow className={"ticker-row"}>
                        Volume (24h)
                    </IonRow>
                    <IonRow text-center className={"ticker-row-value"} >
                        {/* {formatter.format(crypto.crypto['24h_volume_usd'])} */}
                        ${ numbro(crypto.quote.USD["volume_24h"]).format({
                            average: true,
                            mantissa: 2,
                        })}
                    </IonRow>
                </IonCol>

                <IonCol text-center >
                    <IonRow className={"ticker-row"}>
                        % Change (24h)
                    </IonRow>
                    <IonRow text-center className={"ticker-row-value"}>
                        {crypto.quote.USD.percent_change_24h}%
                    </IonRow>
                </IonCol>
                <IonCol text-left >
                    <IonRow className={"ticker-row"}>
                        % Change (1h)
                    </IonRow>
                    <IonRow text-center className={"ticker-row-value"}>
                        {crypto.quote.USD.percent_change_1h}%
                    </IonRow>
                </IonCol>
            </IonRow>
        </IonCardContent>
    </IonCard> 
  );
}

export default Ticker