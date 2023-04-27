const express = require('express');
const app = express();
const port = 8000;

app.get('/',(req,res)=>{
    res.send('hello');
});
app.listen(port,(err)=>{
    if(err){
        console.log(`Error creating server:${err}`);
        return;
    }
    console.log(`Server is running on port:${port}`);
});