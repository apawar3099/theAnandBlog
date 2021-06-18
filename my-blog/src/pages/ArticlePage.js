import React, { useState, useEffect } from "react"
import articleContent from "./article-content"
import ArticlesList from "../components/ArticlesList";
import PageNotFound from "./NotFoundPage";
import CommentsList from "../components/CommentsList";

const ArticlePage = ({ match })=> {
    const name = match.params.name;
    const article = articleContent.find(article => article.name===name )

    const [articleInfo, setArticleInfo] = useState({  upvotes: 0, comments: [] })

    useEffect(()=> {
        const fetchData = async () =>{
            const result = await fetch(`/api/articles/${name}`)
            
            const body = await result.json();
            console.log(body);
            setArticleInfo(body);
        
        }

        fetchData();
        // setArticleInfo({upvotes:})
    },[name]);

    const otherArticles = articleContent.filter(article => article.name !== name);

    if(!article) {
        return <PageNotFound/>;
    }

    return (
    <>
    <h1>{article.title}</h1>
    <p>This post has been upvoted {articleInfo.upvotes} times</p>
    {article.content.map((paragraph, key) => (
    <p key={key}>
        {paragraph}
    </p>)) }

    <br></br>
    <CommentsList comments={articleInfo.comments} />

    <br></br>
    <h2>Related Articles</h2>
    <ArticlesList articles={otherArticles}/>
    </>
 );
};

export default ArticlePage;