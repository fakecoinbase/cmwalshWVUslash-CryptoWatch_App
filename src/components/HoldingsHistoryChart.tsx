import React from 'react'
import '../theme/card.scss';
import { IonCard, IonCardTitle } from '@ionic/react';
import numbro from 'numbro'
import Chart from 'react-apexcharts';
import './holdingsHistoryChart.scss'

interface HoldingsChartProps { 
    total: number
    options: any
    series: any
}

const HoldingsHistoryChart: React.FC<HoldingsChartProps> = ({ total, options, series }) => {

    return (
        <IonCard className={"card ion-padding"}>
            {/* <IonCardTitle>
                Current Holdings: ${numbro(total).format({
                            thousandSeparated: true,
                            mantissa: 2,
                        })}
            </IonCardTitle> */}
            <Chart options={options} type="area" 
                series={[{
                    data: series,
                    name: "Holdings History"
                }]} />
        </IonCard>
    )
}

export default HoldingsHistoryChart