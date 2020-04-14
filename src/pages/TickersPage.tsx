import React, { useState, useEffect } from 'react';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonButtons, IonButton, IonIcon, getConfig, IonModal, IonMenuButton } from '@ionic/react';
import { options } from 'ionicons/icons';
import { useSelector, useDispatch } from 'react-redux';
import { updateCurrentPrices } from '../store/actions/currentPricesActions';
import TickerList from '../components/TickerList';
import { getTopCryptos } from '../firebase/firebase';
import TickersFilter from '../components/TickersFilter';

interface OwnProps { };

const TickersPage: React.FC<OwnProps> = ({ }) => {
  const [showFilterModal, setShowFilterModal] = useState(false);

  const currentPrices:any[] = useSelector((state: any) => state.prices.currentPrices)
  const mode = getConfig()!.get('mode')

  const dispatch = useDispatch()

  const getTickers = () => {
    let tickers = currentPrices.filter(it => it.cmc_rank <= 10).map(t => t.symbol)
    return tickers

  }

  useEffect(() => {
    getTopCryptos().then((resp) => {
        dispatch(updateCurrentPrices(resp));
    }).catch(err => console.log(err));
  }, []);

  const [filteredTickers, setfilteredTickers] = useState(getTickers());

  useEffect(() => {
    // Update the document title using the browser API
    setfilteredTickers(getTickers())
  }, [currentPrices]);

  return (
    <IonPage id="news-page">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Current Prices</IonTitle>

          {/* <IonTitle>Current Prices</IonTitle> */}
          <IonButtons slot="end">
            <IonButton onClick={() => setShowFilterModal(!showFilterModal)}>
              {mode === 'ios' ? 'Filter' : <IonIcon icon={options} slot="icon-only" />}
            </IonButton>
            <IonButton>
              <IonMenuButton ></IonMenuButton>

            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className={`outer-content`}>
      
      <TickerList filteredTickerList={filteredTickers} />
      </IonContent>
      <IonModal
        isOpen={showFilterModal}
        onDidDismiss={() => setShowFilterModal(false)}
      >
        <TickersFilter
          setfilteredTickers={setfilteredTickers}
          onDismissModal={() => setShowFilterModal(false)}
          filteredTickerList={filteredTickers}
          tickerList={currentPrices.map(t => t.symbol)}

        />
      </IonModal>
    </IonPage>
  );
};

export default React.memo(TickersPage)
