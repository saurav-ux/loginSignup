import express from "express";
import bcrypt from "bcryptjs";
const loginRouter = express.Router();
import RegisterData from "../registerSchema.js";
import  jwt  from "jsonwebtoken";


//Post data
loginRouter.post("/", async (req, res) => {
    // console.log("response: ",req.body)
    try {
      const addingData = new RegisterData(req.body);
      const email = req.body.email;
      const useremail = await RegisterData.findOne({ email: email });
      if (useremail !== null ) {
        res.status(400).send("Email Already Exists");
      }
      else if( req.body.name===undefined){
        res.status(400).send("Please Fill Name");   
      }
       else {
        await addingData.save();
        res.status(200).send(true);
      }
      // res.status(201).send(true)
    } catch (error) {
      res.status(500).send("Internal Server Errors in POST: ", error);
    }
  });

//get data
loginRouter.get("/",verifyToken, async (req, res) => {

    try {
      jwt.verify(req.token,"saurckdlopesauravvr",async(err,authData)=>{
          if(err){
              res.status(500).send({message:"Invalid Token"})
          }
          else{
            //  res.status(200).send(authData)
            res.status(200).send(await RegisterData.find({}))
          //   res.status(200).send({message:"Profile Details"})
          }
      })
  
      // res.status(200).send(await ProductData.find({}))
  } catch (error) {
      res.status(500).send("Internal Server Error: " + error)
  }
  });


  //validate
loginRouter.post("/validate", async (req, res) => {
    try {
      const email = req.body.email;
      const password = req.body.password;
      const useremail = await RegisterData.findOne({ email: email });
  
      if (useremail !== null) {
        const isMatch = await bcrypt.compare(password, useremail.password);
        if (isMatch) {
  
          jwt.sign({ userId: useremail._id }, "saurckdlopesauravvr", { expiresIn: '1h' }, (err, token) => {
            if (err) {
                console.log("Token Error: ", err);
                res.status(500).send({ message: "Failed to create token" });  
            } else {
                // res.json({ token });
                res.status(200).send({token:token,status:true,name:useremail.name,id:useremail._id})
            }
        });
        } else {
          res
            .status(401)
            .send({ status: false, name: "Incorrect email or passwords" });
        }
      } else {
        res
          .status(401)
          .send({ status: false, name: "Incorrect email or password" });
      }
    } catch (error) {
      console.error("Internal Server Error:", error);
      res.status(500).send({ error: "Internal Server Error" });
    }
  });


  function verifyToken(req,res,next){
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined'){
        const bearer = bearerHeader.split(" ");
        const token = bearer[1];
         req.token = token;
         next()
    }
    else{
        res.status(500).send({
            message: "Token is not valid"
        })
    }
  }

  export default loginRouter