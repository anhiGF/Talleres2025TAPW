const express= require('express');
const app =express();
const port=3000;

app.use(express.static('views'));

app.get('/',(req,res)=>{
    res.sendFile(__dirname + '/views/index.html');
});

app.listen(port,()=>{console.log(`Server funcionando en http://localhost:${3000}`)});