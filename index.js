const express = require("express")
const app = express();
const aws = require("aws-sdk")
const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(express.json({extended:false}));
app.set("view engine","ejs")
app.set("views","./views")
//config
const region = "us-east-2";
const accessKeyId = "AKIAJWWUZXCFAK6WGVOA";
const secretAccessKey = "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";
app.listen(5000,(err)=>{
    if(err)
        console.log("Loi: ",err);
    else
        console.log("server runing port 5000");
});

const dynamoDB = new aws.DynamoDB.DocumentClient({
    region: region,
    accessKeyId : accessKeyId,
    secretAccessKey : secretAccessKey
})
// get danh sach 
app.get("/",(req,res)=>{
    const paramsDanhSachLinhKien = {
        TableName : "SanPham",
    };
    dynamoDB.scan(paramsDanhSachLinhKien,(error,data)=>{
        if(error)
            console.log(JSON.stringify(error,null,2));
        else 
            res.render("index",{
                linhKien : data.Items
            });
    });
});
// add linh kien /api/addLinhKien
app.post("/api/addLinhKien",(req,res)=>{
    const {maSanPham,ten,soLuong} = req.body;
    console.log(maSanPham);
    const linhKien = {
        maSanPham : maSanPham,
        ten : ten,
        soLuong : soLuong
    };
    const paramsAddLinhKien = {
        TableName : "SanPham",
        Item: linhKien
    };
    dynamoDB.put(paramsAddLinhKien,(error,data)=>{
        if(error){
            console.log("Loi",error);
            return res.json({msg:"Lỗi khi thêm"});
        }
        else 
            res.redirect("/");
           // return res.json({msg:"Thêm thành công!!!!"});
    });
});
// delete 
app.post("/deleteLinhKien",(req,res)=>{
    const maSanPham = req.body.maSanPham;
    const paramsDeleteLinhKien= {
        TableName : "SanPham",
        Key : {
            "maSanPham" : maSanPham,
        },
    };
    dynamoDB.delete(paramsDeleteLinhKien,(error,data)=>{
        if(error)
            console.log(error)
        else  
            res.redirect("/");
    });
});
