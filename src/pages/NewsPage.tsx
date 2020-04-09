import React, { useEffect, useState } from 'react';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonButtons, IonMenuButton } from '@ionic/react';
import ArticleList from '../components/ArticleList';

interface OwnProps { };

interface DispatchProps { };

interface SpeakerListProps extends OwnProps, DispatchProps { };

const NewsPage: React.FC<SpeakerListProps> = ({}) => {

    const [news, setNews] = useState<any[]>([])

    useEffect(() => {
        fetch('https://mighty-dawn-74394.herokuapp.com/live')
            .then(response => response.json())
            .then(articles => {
                setNews(articles);
            }).catch(error => console.log(error)
        );
    }, [])

    return (
        <IonPage id="news-page">
            <IonHeader>
                <IonToolbar>
                <IonButtons slot="start">
                    <IonMenuButton />
                </IonButtons>
                <IonTitle>Recent News</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent className={`outer-content`}>
                <ArticleList news={news} />
            </IonContent>
        </IonPage>
    );
};

export default React.memo(NewsPage)