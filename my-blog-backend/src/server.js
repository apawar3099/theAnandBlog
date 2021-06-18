import express from "express"
import bodyParser from "body-parser"
import path from "path";
import {MongoClient} from 'mongodb';

const app = express();


app.use(express.static(path.join(__dirname, "/build")))
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


const withDB = async (operations, res)=>{

    try {
        const client = await MongoClient.connect("mongodb://localhost:27017", {useNewUrlParser: true});
    
        const db = client.db("my-blog");
    
        await operations(db);

        res.status(200).json(articlesInfo); //json() is same as send()
    
        client.close();
        }
        catch(error){
            res.status(500).json({message: "Internal server problem occured, error connecting to DB ", error})
        }
    

}

app.get("/api/articles/:name", async (req, res) => {
    withDB(async (db) => {

        const articleName = req.params.name;

        const articlesInfo = await db.collection("articles").findOne({name : articleName});
    
        res.status(200).json(articlesInfo); //json() is same as send()

    }, res); /// this whole is actually a (withDB FUNCTION CALL)

});

app.post("/api/articles/:name/upvote", async (req, res) => {
    withDB(async (db) => {
    
    const articleName = req.params.name;

    const articlesInfo = await db.collection("articles").findOne({name : articleName});

    await db.collection("articles").updateOne({name : articleName}, 
        {'$set' : 
            {
                upvotes: articlesInfo.upvotes+1,
            },
    });

    const updatedArticlesInfo = await db.collection("articles").findOne({name : articleName});

    res.status(200).json(updatedArticlesInfo);
    }, res);
    
    
})  

// app.post("/api/articles/:name/upvote", async (req, res) => {
//     try{
//     const articleName = req.params.name;

//     const client = await MongoClient.connect("mongodb://localhost:27017", {useNewUrlParser: true});

//     const db = client.db("my-blog");

//     const articlesInfo = await db.collection("articles").findOne({name : articleName});

//     await db.collection("articles").updateOne({name : articleName}, 
//         {'$set' : 
    //         {
    //             upvotes: articlesInfo.upvotes+1,
    //         },
//     });

//     const updatedArticlesInfo = await db.collection("articles").findOne({name : articleName});

//     res.status(200).json(updatedArticlesInfo);
//     client.close();
//     }
//     catch(error){
//         res.status(500).json({message: "Internal server problem occured, error connecting to DB ", error})
//     }

    
// })   // THIS IS POST CODE WITHOUT REFRACTORING

app.post("/api/articles/:name/add-comment",  async (req, res) => {
    const { username, text } = req.body;
    const articleName = req.params.name;

    withDB(async (db) =>{
        const articlesInfo = await db.collection("articles").findOne({name : articleName});

        await db.collection("articles").updateOne({name : articleName}, 
            {'$set' : 
                {
                    comments: articlesInfo.comments.concat({username, text}),
                },
        });
        
        const updatedArticlesInfo = await db.collection("articles").findOne({name : articleName});

        res.status(200).json(updatedArticlesInfo) 
    },res);

})


// app.post("/api/articles/:name/upvote", (req, res) => {
//     const articleName = req.params.name;

//     articlesInfo[articleName].upvotes +=1;
//     res.status(200).send(`${articleName} now has ${articlesInfo[articleName].upvotes} upvotes`)
// }) // THIS WAS POST METHOD BEFORE USING MONGODB

// app.post("/api/articles/:name/add-comment", (req, res) => {
//     const { username, text } = req.body;
//     const articleName = req.params.name;

//     articlesInfo[articleName].comments.push({username, text});

//     res.status(200).send(articlesInfo[articleName]);
// }) // THIS WAS POST METHOD BEFORE USING MONGODB


app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname + "/build/index.html"))
})  //requests that aren't caught by any of our other API routes that aren't caught by any of our other API routes should be passes on to our app

app.listen(8000, ()=> console.log("listening on PORT 8000 "))