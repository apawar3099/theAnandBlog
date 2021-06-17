import React from "react"
import articleContent from "./article-content"
// import {Link} from "react-router-dom";
import ArticlesList from "../components/ArticlesList";

const ArticlesListPage = ()=> (
    <>
    <h1>My Articles</h1>

    <ArticlesList articles={articleContent}/>
    
    </>
);

export default ArticlesListPage;