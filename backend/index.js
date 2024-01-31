import express from "express"
const app = express()
import loginRouter from "./Database/Model/Router/loginRouter.js";
import cors from "cors";
import "./Database/connection.js"
app.use(cors());
app.use(cors({
  origin:['https://deploy-mern-1whq.vercel.app'],
  methods:['POST','GET','PATCH','DELETE'],      
  credentials:true
}))

app.use(express.json());
const PORT =  process.env.PORT || 5007;
app.get('/',(req,res)=>{
    res.send("Hello Saurav Authentication")
})
app.use('/login',loginRouter)
app.listen(PORT,()=>{
    console.log(`Server is running on : http://localhost:${PORT}`)
})

