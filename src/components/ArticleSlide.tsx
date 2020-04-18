import moment from "moment";
import { IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent } from "@ionic/react";
import React from "react"
import "./ArticleSlide.scss"

interface Props {
    article: any
    id: any
}

const Article: React.FC<Props> = ({article, id}) => {
    let url = article.urlToImage !== undefined ? article.urlToImage : article.imageurl;
    const date = article.publishedAt !== undefined ? moment(article.publishedAt).format("llll") :
      moment(article.published_on * 1000).format("llll")
    return (
        <IonCard className={"article-slide-card"} >
            <img className={"slide-article-img"} src={url} />
            <IonCardHeader>
            <IonCardSubtitle className={"article-slide-source"}>
                    {article.source_info ? article.source_info.name : article.source.name}
                </IonCardSubtitle>
                <IonCardTitle>
                    {article.title} 
                </IonCardTitle>
                <IonCardSubtitle className={"article-slide-subtitle"}>
                    <div className="articleDate">{date}</div>
                </IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent className={"slide-card-body"}>
                {article.body ? article.body.substring(0, 250) + "..." : article.description ? article.description.substring(0, 250) + "..." : ""}
                <div className={"slide-article-link"}>
                    <a className="readMore" href={`${article.url}`} target="_blank">Read More</a>
                </div>
            </IonCardContent>
        </IonCard>
    )
}

export default Article