let userid=-1;
const express=require("express");
const app=express();
const mysql = require('mysql2');
const path=require("path");
//const userRouter=require("./routes/user.js");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({encoded: true}));
const methodOverride=require("method-override");
const ejsmate=require("ejs-mate"); // it is use for the templating as navbar is present at every page
app.engine('ejs', ejsmate);
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.json());
//app.use("/",userRouter);
// Create the connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'project',
    password: 'aman1234'
  });
//THIS IS FOR DATA INPUT.
// let q="INSERT INTO items (id,item,description,price,etime,seller,img) VALUES ? ";
// let user=[["123","watch","unique","10000","90","rajesh","https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
// ["133","home","antique","10000","90","rajesh","https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1916&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
// ["1223","watch","unique","10000","90","rajesh","https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"]];
// try{
//     connection.query(q,[user],(err,result)=>{
//         if(err) throw err;
       
//     });
// }catch(err){
//     console.log("error hai");
// }
app.get("/",(req,res)=>{
    res.send("HOME ROUTE");
});
/*To display all the users*/
app.get("/listing/display",(req,res)=>{
        let q = "SELECT * FROM users WHERE id !='72@45' ORDER BY id";
        connection.query(q,(err,result)=>{
            console.log(result);
            res.render("listing/display.ejs",{result});
        });
});
/*MY ORDERD*/
app.get("/listing/myorders",(req,res)=>{
    let q=`select id,price,item from itemsell where userid='${userid}'`;
    connection.query(q,(err,result)=>{
            res.render("listing/myorders.ejs",{result});
    });
});
/*Buying History*/

app.get("/listing/history",(req,res)=>{
    let q=`select * from itemsell Order by id`;
    connection.query(q,(err,result)=>{
        res.render("listing/history.ejs",{result});
    });
});
//INDEX ROUTE
app.get("/listing",(req,res)=>{
    let q=`SELECT * FROM items`;
    try{
      connection.query(q,(err,result)=>{
          if(err) throw err;
          if(userid=="72@45"){
            res.render("listing/indexadmin.ejs",{result});
          }
          else if(userid==-1){
          res.render("listing/index.ejs",{result});
          }
          else{
            res.render("listing/indexuser.ejs",{result});
          }
         
      })
  }catch(err){
      console.log("error hai");
  }
  });
//NEW ROUTE
app.get("/listing/new",(req,res)=>{
    res.render("listing/new.ejs")
});

// //SHOW ROUTE: TO DISPLAY THE CONTENT OF THE INDIVIDUAL ITEMS.
app.get("/listing/:id",(req,res)=>{
    let {id}=req.params;
    let q=`select * from items where id='${id}'`;
    try{
        connection.query(q,(err,result)=>{
            if(err) throw err;
            let item=result[0];
            if(userid=="72@45")
            res.render("listing/showadmin.ejs",{item,userid});
            else if(userid==-1) res.render("listing/show.ejs",{item,userid});
            else{
                res.render("listing/showuser.ejs",{item,userid});
            }
        });
    }catch(err){
        console.log("error hai");
    }
});
//storing the bid
app.post("/end-deal", (req, res) => {
    const { id,  userid ,item , price} = req.body;
    const qu = `select username from users where id='${userid}'`;
    connection.query(qu,(err, result) => {
            let username=result[0].username;
            console.log(username);
            const query = 'INSERT INTO itemsell (id, userid,price,item,username) VALUES (?, ?,?,?,?)';
            const q=`DELETE FROM items where id='${id}'`;
            connection.query(query, [id, userid,price,item,username], (err, result) => {
             console.log('Database insertion successful');
            connection.query(q, (err, result) => {
                console.log('deleted succesfully');
            });
            res.redirect("/listing"); // Redirect to the listing page after successful insertion
    });
});
});
//Unsold
app.post("/unsold",(req,res)=>{
    console.log("yes");
    const {id,price,item}=req.body;
    const q="INSERT INTO notsell (id,price,item) VALUES (?,?,?)";
    const q2=`DELETE FROM items where id='${id}'`;
    connection.query(q,[id,price,item],(err,result)=>{
        connection.query(q2, (err, result) => {
            console.log('deleted succesfully');
        });
        res.redirect("/listing");
    });
});
app.get("/notsold",(req,res)=>{
    let q="SELECT * FROM notsell";
    connection.query(q,(err,result)=>{
        res.render("listing/unsold.ejs",{result});
    });
});

// //CREATE ROUTE: TO ADD NEW ITEMS IN THE DATABASE
app.post("/listing",(req,res)=>{
    let {id,item,description,price,etime,seller,img}=req.body;
    let user=[id,item,description,price,etime,seller,img];
    let q="INSERT INTO items (id,item,description,price,etime,seller,img) VALUES (?,?,?,?,?,?,?) ";
    try{
        connection.query(q,user,(err,result)=>{
            if(err) throw err;
               console.log("okkk");
               res.redirect("/listing");
            });
        }catch(err){
            console.log("error hai");
        }
});
// //EDIT ROUTE
app.get("/listing/:id/edit",(req,res)=>{
    let {id}=req.params;
    let q=`select * from items where id='${id}'`;
    try{
        connection.query(q,(err,result)=>{
            if(err) throw err;
            let item=result[0];
            res.render("listing/edit.ejs",{item});
        });
    }catch(err){
        console.log("error hai");
    }
});
app.post("/listing/:id/edit/price",(req,res)=>{
    let {id}=req.params;
    let {price}=req.body;
    let q=`UPDATE items SET price='${price}' WHERE id='${id}'`;
    let q1=`Select price from items WHERE id='${id}'`;
    connection.query(q1,(err,result)=>{
        if(result[0].price < price){
        connection.query(q,(err,result)=>{
            if(err) throw err;
            let item=result[0];
            res.redirect(`/listing/${id}`);
        });
        }
        else{
            res.redirect(`/listing/${id}`);
        }
    });
});
// //UPDATE ROUTE
app.patch("/listing/:id",(req,res)=>{
    let {id}=req.params;
    let {item,description,price,etime,img}=req.body;
    //let user=[item,description,price,etime,img];
    let q=`UPDATE items SET  item='${item}',description='${description}' ,price='${price}' ,etime='${etime}', img='${img}' WHERE id='${id}'`;
    try{
        connection.query(q,(err,result)=>{
            if(err) throw err;
               console.log("okkk");
               res.redirect("/listing");
            });
        }catch(err){
            console.log("error hai");
        }
});
app.delete("/listing/:id",(req,res)=>{
    let {id}=req.params;
    let q=`DELETE FROM items WHERE id='${id}'`;
    try{
        connection.query(q,(err,result)=>{
            if(err) throw err;
               console.log("okkk");
               res.redirect("/listing");
            });
        }catch(err){
            console.log("error hai");
        }         
 });
 /*add temporary*/
 /*add temporary*/
 app.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
});
app.post("/signup",(req,res)=>{
    let {id,username,gmail,password}=req.body;
    let user=[id,username,gmail,password];
    let q1=`INSERT INTO users (id,username,gmail,password) VALUES (?,?,?,?)`;
    let q2=`select count(*) from users where username='${username}'`;
    try{
        connection.query(q2,(err,result)=>{
            if(err) throw err;
               let p=result[0]['count(*)'];
               if(p==0){
                connection.query(q1,user,(err,result)=>{
                    if(err) throw err;
                       console.log("okkk");
                       userid=id;
                       res.redirect("/listing");
                    });
               }
               else{
                res.redirect("/signup");
               }
            });
        }catch(err){
            res.send("Not unique");
        }
});

/*add temporary*/
app.get("/login",(req,res)=>{
    res.render("users/login.ejs");
});
app.post("/login",(req,res)=>{
    let {id,username,password}=req.body;
    userid=id;
    let user=[id,username,password];
    //console.log(user);
    let q2=`select count(*) from users where username='${username}' AND password='${password}'`;
    try{
        connection.query(q2,(err,result)=>{
            if(err) throw err;
               let p=result[0]['count(*)'];
               if(p==1){
                    res.redirect("/listing");
               }
               else{
                res.redirect("/login");
               }
            });
        }catch(err){
            res.send("Not unique");
        }
});
app.get("/logout",(req,res)=>{
    userid=-1;
    res.redirect("/listing");
});

app.listen(8080,()=>{
    console.log("server started");

});
