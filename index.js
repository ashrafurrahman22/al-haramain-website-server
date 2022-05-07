const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.z2iok.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run (){
    try{
        await client.connect();
        const productCollection = client.db('perfumes').collection('product');
        const itemCollection = client.db('perfumes').collection('item');

        app.get('/product', async (req, res)=>{
            const query = {};
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        });

        // catch single item
        app.get('/product/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const product = await productCollection.findOne(query);
            res.send(product);
        })

        // post 
        app.post('/product', async(req, res)=>{
            const newProduct = req.body;
            const result = await productCollection.insertOne(newProduct);
            res.send(result);
        });
        // update stock
        app.put('/product/:id', async(req, res)=>{
            const id = req.params.id;
            const updatedProduct = req.body;
            const filter = {_id : ObjectId(id)};
            const options = { upsert : true };
            const updatedDoc = {
                $set : {
                    quantity : updatedProduct.quantity
                }
            };
            const result = await productCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        })

        // Delete
        app.delete('/product/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await productCollection.deleteOne(query);
            res.send(result);

        });

        // item collection API 
        app.get('/addItem', async(req, res)=>{
            const email = req.query.email;
            const query = {email: email};
            const cursor = itemCollection.find(query);
            const items = await cursor.toArray();
            res.send(items);
        });


        // post
        app.post('/addItem', async (req, res) =>{
                const addItem = req.body;
                const result = await itemCollection.insertOne(addItem);
                res.send(result);
        });

        // Delete
        app.delete('/addItem/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await itemCollection.deleteOne(query);
            res.send(result);

        });
        
    }
    finally{

    }
}
run().catch(console.dir)


app.get('/', (req, res)=>{
    res.send('haramain perfumes server is running')
});

app.listen(port, ()=>{
    console.log('Haramain perfumes server is running on port', port);
});
