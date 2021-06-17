import express from "express"
import bodyParser from "body-parser"

import {MongoClient} from 'mongodb';

const app = express();

app.use(bodyParser.urlencoded())
app.use(bodyParser.json())

// const articlesInfo ={
//     'learn-react':{
//         upvotes:0,
//         comments : [],
//     },
//     'learn-node':{
//         upvotes:0,
//         comments : [],
//     },
//     'my-thoughts-on-resumes':{
//         upvotes:0,
//         comments : [],
//     },
// }  // Added in MongoDB , so NO use now

// app.get("/hello", (req, res) =>{
//     res.send("Hello!!!")
// });

// app.get("/hello/:name", (req, res) => {
//     res.send(`Hello ${req.params.name}!`)
// })
// app.post("/hello", (req, res) =>{
//     res.send(`Hello ${req.body.name}!`)
// });


app.get("/api/articles/:name", async (req, res) => {

    try {
    const articleName = req.params.name;

    const client = await MongoClient.connect("mongodb://localhost:27017", {useNewUrlParser: true});

    const db = client.db("my-blog");

    const articlesInfo = await db.collection("articles").findOne({name : articleName});

    res.status(200).json(articlesInfo); //json() is same as send()

    client.close();
    }
    catch(error){
        res.status(500).json({message: "Internal server problem occured, error connecting to DB ", error})
    }

})

// app.post("/api/articles/:name/upvote", (req, res) => {
//     const articleName = req.params.name;

//     articlesInfo[articleName].upvotes +=1;
//     res.status(200).send(`${articleName} now has ${articlesInfo[articleName].upvotes} upvotes`)
// })

// app.post("/api/articles/:name/add-comment", (req, res) => {
//     const { username, text } = req.body;
//     const articleName = req.params.name;

//     articlesInfo[articleName].comments.push({username, text});

//     res.status(200).send(articlesInfo[articleName]);
// })

app.listen(8000, ()=> console.log("listening on PORT 8000 "))