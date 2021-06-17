import React from "react"
import articleContent from "./article-content"
import ArticlesList from "../components/ArticlesList";
import PageNotFound from "./NotFoundPage";

const ArticlePage = ({ match })=> {
 const name = match.params.name;
 const article = articleContent.find(article => article.name===name )

    const otherArticles = articleContent.filter(article => article.name !== name);

    if(!article) {
        return <PageNotFound/>;
    }

 return (
    <>
    <h1>{article.title}</h1>
    {article.content.map((paragraph, key) => (
    <p key={key}>
        {paragraph}
    </p>)) }

    <br></br>
    <h2>Related Articles</h2>
    <ArticlesList articles={otherArticles}/>
    </>
 );
};

export default ArticlePage;