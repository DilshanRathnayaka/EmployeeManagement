const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const EmployeeRoute = require("./Routes/Employee");

dotenv.config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended : false}));

const PORT = process.env.PORT

app.listen(PORT,()=>{
    console.log(`Server Start On ${PORT}`)
})

mongoose.connect(process.env.DB_URL).then((res)=>{
    console.log("DB Connected");
}).catch((err)=>{
    console.log(err);
})


app.use("/api/Employee",EmployeeRoute);