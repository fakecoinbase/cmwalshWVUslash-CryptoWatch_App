import React from 'react'
import '../theme/card.scss';
import { IonCard } from '@ionic/react';
import ClipLoader from "react-spinners/ClipLoader";
import { css } from "@emotion/core";
import Chart from 'react-apexcharts';
import { useSelector } from 'react-redux';
import './holdingsHistoryChart.scss'


const HoldingsChart: React.FC = ({  }) => {
    
  const  holdingsMap = useSelector((state:any) => state.coinbase.holdingsMap)
  const loadingHoldings = useSelector((state: any) => state.coinbase.loadingHoldings)

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
          <Chart options={holdingsMap.options} series={holdingsMap.series} type="pie"  />
      }
    </IonCard>
  )
}

export default HoldingsChart