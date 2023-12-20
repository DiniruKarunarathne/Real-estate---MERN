import express from 'express';
const app = express();

const PORT = process.env.PORT || 8070 ; 

app.listen(PORT,() =>{
    console.log(`Server is up and running on port ${PORT}`);
});