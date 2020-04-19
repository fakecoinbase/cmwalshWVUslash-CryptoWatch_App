import React from 'react'
import '../theme/card.scss';
import { IonCard } from '@ionic/react';
import Chart from 'react-apexcharts';
import './holdingsHistoryChart.scss'

interface HoldingsChartProps { 
    total: number
    options: any
    series: any
}

const HoldingsHistoryChart: React.FC<HoldingsChartProps> = ({ total, options, series }) => {

    return (
        <IonCard className={"history-chart card ion-padding"}>
            <Chart options={options} type="area" 
                series={[{
                    data: series,
                    name: "Holdings History"
                }]} />
        </IonCard>
    )
}

export default HoldingsHistoryChart