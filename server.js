//using express
const express=require('express');
const mongoose=require('mongoose');
const cors=require('cors');

//create an express app
const app=express();

//middleware to parse json data
app.use(express.json());
app.use(cors());

//connect mongodb
mongoose.connect('mongodb://127.0.0.1:27017/mern-app')
.then(()=>{
    console.log("connected to mongodb");
})
.catch((error)=>{
    console.log(error);
})

//create a schema
const todoSchema=new mongoose.Schema({
    title:{
        required:true,
        type:String,
    },
    description:String
})

//create a model
const todoModel=mongoose.model('Todo',todoSchema);

//define a route (for api services from url)

//1)create a new todo list
app.post('/todos', async (req, res) => {
    const{title,description}=req.body;
    try{
        const newtodo=new todoModel({title,description});
        await newtodo.save();
        res.status(201).json(newtodo);
    }
    catch(error){
        console.log(error);
        res.status(500).send("Internal server error");
    }  
})

//2)get all items
app.get('/todos',async (req,res)=>{
    try{
        const getdata = await todoModel.find();
        res.json(getdata)
    }
    catch{
        console.log(error);
        res.status(500).send("getting data error");

    }
    
})

//3)update item
app.put('/todos/:id',async (req,res)=>{
    try{
    const{title,description}=req.body;
    const id=req.params.id;
    const updated=await todoModel.findByIdAndUpdate(
        id,
        {title,description},
        {new:true}
    )

    if(!updated){
        return res.status(404).send("item not found");
    }
    res.json(updated);
}
catch{
    console.log(error);
    res.status(500).send("updated data error");
}
})



//4)Delete item
app.delete('/todos/:id', async (req,res)=>{
    try{
        const id=req.params.id;
        await todoModel.findByIdAndDelete(id );
        res.status(204).end();

    }
    catch{
        console.log(error);
        res.status(500).send("deleting data error");

    }
})

//start server
const port=8000;
app.listen(port,()=>{
    console.log("server listening to port: "+port);
})