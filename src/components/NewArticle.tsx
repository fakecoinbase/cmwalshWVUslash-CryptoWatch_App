import moment from "moment";
import { IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent } from "@ionic/react";
import React from "react"
import "./Article.scss"

interface Props {
    article: any
    id: any
}

const Article: React.FC<Props> = ({article, id}) => {
    let url = article.urlToImage !== undefined ? article.urlToImage : article.imageurl;
    const date = article.publishedAt !== undefined ? moment(article.publishedAt).format("llll") :
      moment(article.published_on * 1000).format("llll")
    return (
        <IonCard className={"article-card"} >
            <img className={"article-img"} src={url} />
            <IonCardHeader>
                
                <IonCardTitle>
                    {article.title} 
                </IonCardTitle>
                <IonCardSubtitle>
                    {article.source_info ? article.source_info.name : article.source.name}
                    <div className="articleDate">{date}</div>
                </IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
                {article.body ? article.body.substring(0, 150) + "..." : article.description ? article.description.substring(0, 150) + "..." : ""}
                <div className={"articleFlex"}>
                    <a className="readMore" href={`${article.url}`} target="_blank">Read More</a>
                </div>
            </IonCardContent>
        </IonCard>
    )
}

export default Article