import React, { useState, useEffect } from 'react'
import '../theme/card.scss';
import { IonCard, IonButton } from '@ionic/react';
import ClipLoader from "react-spinners/ClipLoader";
import { css } from "@emotion/core";
import Chart from 'react-apexcharts';
import { useSelector } from 'react-redux';
import './holdingsHistoryChart.scss'

interface HoldingsChartProps { 
}

const HoldingsChart: React.FC<HoldingsChartProps> = ({  }) => {
    
    const [holdingsMapping, setHoldingsMapping] = useState<any>({series: []})
    const  holdingsMap = useSelector((state:any) => state.coinbase.holdingsMap)
    const loadingHoldings = useSelector((state: any) => state.coinbase.loadingHoldings)

    useEffect(() => {
        mapTickerHoldings()
    }, [holdingsMap])

    const options = {
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

    const mapTickerHoldings = () => {
        let mapping:any = [];
        mapping.options = options;
        mapping.series = [];
        mapping.options.labels = [];
        
        if (holdingsMap !== undefined && holdingsMap.length > 0) {
            holdingsMap.forEach((holding: any) => {
                try {
                var total = Number(holding.amount) * holding.currentPrice.quote.USD.price;
                mapping.series.push(Number(total.toFixed(2)));
                mapping.options.labels.push(holding.ticker)
                } catch {
                    console.log(`Error with  holdings: ${holding.ticker}`)
                }
            })
            setHoldingsMapping(mapping)
            return mapping
            
        }
    }       
    
      
    const override = css`
        display: block;
        margin: 25px auto;
        size: 5px;
        width: 60px;
        height: 60px;
        border-color: red;
    `;

    const noData = (
        <div className="noData">
            <div className="defaultMessage"> No Current Holdings...</div>
            <div className="addHoldings">Add your holdings!
            {/* <i className="material-icons addHoldingsButton Small" onClick={() => this.toggleModal()}>library_add</i> */}
            </div>
        </div>
    )   

    return (
        <IonCard className={"card ion-padding"}>
            {
                loadingHoldings ? 
                    <ClipLoader
                                css={override}
                                size={150}
                                //size={"150px"} this also works
                                color={"#339989"}
                                loading={true}
                            />
                    :
                holdingsMap === undefined ?
                    noData
                :
                    <Chart options={holdingsMap.options} series={holdingsMap.series} type="pie" height={450} />
            }
        </IonCard>
    )
}

export default HoldingsChart