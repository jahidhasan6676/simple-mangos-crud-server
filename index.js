const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express();


// middleware
app.use(cors());
app.use(express.json());

// ZmnQjd38sxpJxyFw
// UserDB




const uri = "mongodb+srv://UserDB:ZmnQjd38sxpJxyFw@cluster0.wwm8j.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const usersCollection = client.db("UsersCollection").collection("Users");
    // const movies = database.collection("Mango");

    app.get("/users", async(req, res) =>{
        const cursor = usersCollection.find();
        const result = await cursor.toArray();
        res.send(result)
    });

    app.get("/users/:id", async(req, res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await usersCollection.findOne(query);
        res.send(result);

    })

    app.post("/users", async(req, res) =>{
      const users = req.body;
      console.log(users)

      const result = await usersCollection.insertOne(users);
      res.send(result)
    });


    app.put("/users/:id", async(req,res)=>{
        const id = req.params.id;
        const user = req.body;
        const filter = {_id: new ObjectId (id)};
        const options = { upsert: true };
        const updateUser = {
            $set: {
                name:user.name,
                email:user.email
            }
        }
        const result = await usersCollection.updateOne(filter, updateUser, options);
        res.send(result);
    })

    

    app.delete("/users/:id", async(req,res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId (id)}
        const result = await usersCollection.deleteOne(query);
        res.send(result);
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get("/", (req, res) =>{
    res.send('simple server running')
});

app.listen(port, ()=>{
    console.log(`crud server port is: ${port}`)
})
