const express=require('express');
const mongoose=require('mongoose');
const cors=require('cors');
const app=express();
app.use(express.json());
app.use(cors())
//define rout
app.get('/',(req,res)=>{
    res.send("hello world")
})
//let Todos=[];
mongoose.connect('mongodb://localhost:27017/mern-app')
.then(()=>{
    console.log("db connected")
})
.catch((err)=>{
  console.log(err);
})
//schema
const todoschema =new mongoose.Schema({
    title: {
        required: true,
        type: String
    },
    description: String
})
//modal
const todomodel =mongoose.model('Todo',todoschema);

app.post('/todos',async (req,res)=>{
   const{title,description}= req.body;
   try{
    const newtodo =new todomodel({
   title,description
   });
  await newtodo.save();
    res.status(201).json(newtodo);
   }
   catch(error){
       console.log(error);
       res.status(500).json({msg: error.message});
   }
 
})
app.put('/todos/:id',async (req,res)=>{
    try{
        const {title,description}= req.body;
        const id=req.params.id;
        const utodo=await todomodel.findByIdAndUpdate(
            id,
            {title,description},
            {new: true} 
        )
        if(!utodo){
            return res.status(404).json({message: "todo not found"})
        }
        res.json(utodo);
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
  //  res.status(201).send(utodo);
})
app.get('/todos',async (req,res)=>{
    try{
       const Todos=await todomodel.find()
       res.json(Todos);
    }
   catch(error){
   res.status(500).json({msg: error.msg});
   }
})
app.delete('/todos/:id',async (req,res)=>{
    try{
    const id=req.params.id;
    await todomodel.findByIdAndDelete(id);
    res.status(204).end();
    }
    catch(error){
        console.log(error);
           res.status(500).json({msg: error.message});
    }
})
const port=8000;
app.listen(port,()=>
{
    console.log("server is listening"+port);
})