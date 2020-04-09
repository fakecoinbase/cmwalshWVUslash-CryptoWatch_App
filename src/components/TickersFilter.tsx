import React from 'react';
import { IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonList, IonListHeader, IonItem, IonLabel, IonToggle, IonFooter, IonIcon } from '@ionic/react';

interface OwnProps {
  onDismissModal: () => void;
  filteredTickerList: any[];
  tickerList: any[];
  setfilteredTickers: any
}

const TickersFilter: React.FC<OwnProps> = ({ setfilteredTickers, filteredTickerList, tickerList, onDismissModal }) => {

  const toggleTrackFilter = (ticker: string) => {
    if (filteredTickerList.indexOf(ticker) > -1) {
      setfilteredTickers(filteredTickerList.filter(x => x !== ticker));
    } else {
      setfilteredTickers([...filteredTickerList, ticker]);
    }
  };

  const handleDeselectAll = () => {
    setfilteredTickers([]);
  };

  const handleSelectAll = () => {
    setfilteredTickers([...tickerList]);
  };

  console.log(tickerList)
  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            Tickers To Display
            </IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onDismissModal} strong>Done</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent class="outer-content">
        <IonList>
          {tickerList.map((ticker, index) => (
            <IonItem key={index}>
              {/* <IonIcon className="filter-icon" icon={iconMap[track]} color="medium" /> */}
              <IonLabel>{ticker}</IonLabel>
              <IonToggle
                onClick={() => toggleTrackFilter(ticker)}
                checked={filteredTickerList.indexOf(ticker) !== -1}
                color="success"
                value={ticker}
              ></IonToggle>
            </IonItem>
          ))}
        </IonList>
      </IonContent>

      <IonFooter>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={handleDeselectAll}>Deselect All</IonButton>
          </IonButtons>
          <IonButtons slot="end">
            <IonButton onClick={handleSelectAll}>Select All</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonFooter>
    </>
  );
};

export default React.memo(TickersFilter)
