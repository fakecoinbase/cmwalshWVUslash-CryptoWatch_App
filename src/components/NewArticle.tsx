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
    
    console.log(article)
    return (
        <IonCard className={"article-card"} >
            <img className={"article-img"} src={url} />
            <IonCardHeader>
                <IonCardSubtitle>
                    {article.source_info ? article.source_info.name : article.source.name}
                </IonCardSubtitle>
                <IonCardTitle>
                    {article.title}
                </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
                {article.body ? article.body.substring(0, 150) + "..." : article.description ? article.description.substring(0, 150) + "..." : ""}
                <div className={"articleFlex"}>
                    <div className="articleDate">{date}</div>
                    <a className="readMore" href={`${article.url}`} target="_blank">Read More</a>
                </div>
            </IonCardContent>
        </IonCard>
    )
}

export default Article