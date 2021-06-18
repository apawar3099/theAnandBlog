import React, { useState, useEffect } from "react"
import articleContent from "./article-content"
import ArticlesList from "../components/ArticlesList";
import PageNotFound from "./NotFoundPage";
import CommentsList from "../components/CommentsList";
import UpvotesSection from "../components/UpvotesSection";
import AddCommentForm from "../components/AddCommentForm";


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
        
        } //useEffect parameters cant use async keyword directly so we have to make another func inside it

        fetchData();
    
    },[name]);  // "name" is in dependancy array cause as soon as name param chnage we want to fetch new data

    const otherArticles = articleContent.filter(article => article.name !== name);

    if(!article) {
        return <PageNotFound/>;
    }

    return (
    <>
    <h1>{article.title}</h1>

    <UpvotesSection articleName={name} upvotes = {articleInfo.upvotes} setArticleInfo={setArticleInfo}/>

    {article.content.map((paragraph, key) => (
    <p key={key}>
        {paragraph}
    </p>)) }

    <br></br>

    <AddCommentForm articleName={name}  setArticleInfo={setArticleInfo}/>
    <CommentsList comments={articleInfo.comments} />

    <br></br>
    <h2>Related Articles</h2>
    <ArticlesList articles={otherArticles}/>
    </>
 );
};

export default ArticlePage;