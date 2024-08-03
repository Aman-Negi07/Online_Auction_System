
// const express=require("express");
// const  router=express.Router();
// const mysql = require('mysql2');
// const connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     database: 'project',
//     password: 'aman1234'
//   });
// router.get("/signup",(req,res)=>{
//     res.render("users/signup.ejs");
// });
// router.post("/signup",(req,res)=>{
//     let {id,username,gmail,password}=req.body;
//     let user=[id,username,gmail,password];
//     let q1=`INSERT INTO users (id,username,gmail,password) VALUES (?,?,?,?)`;
//     let q2=`select count(*) from users where username='${username}'`;
//     try{
//         connection.query(q2,(err,result)=>{
//             if(err) throw err;
//                let p=result[0]['count(*)'];
//                if(p==0){
//                 connection.query(q1,user,(err,result)=>{
//                     if(err) throw err;
//                        console.log("okkk");
//                        res.redirect("/listing");
//                     });
//                }
//                else{
//                 res.redirect("/signup");
//                }
//             });
//         }catch(err){
//             res.send("Not unique");
//         }
// });
// router.get("/login",(req,res)=>{
//     res.render("users/login.ejs");
// });
// router.post("/login",(req,res)=>{
//     let {id,username,password}=req.body;
//     let user=[id,username,password];
//     console.log(user);
//     let q2=`select count(*) from users where username='${username}' AND password='${password}'`;
//     try{
//         connection.query(q2,(err,result)=>{
//             if(err) throw err;
//                let p=result[0]['count(*)'];
//                if(p==1){
//                     res.redirect("/listing");
//                }
//                else{
//                 res.redirect("/login");
//                }
//             });
//         }catch(err){
//             res.send("Not unique");
//         }
// });
// module.exports=router;