require('dotenv').config();
const express = require("express"),
    app = express(),
    //bodyParser = require("body-parser"),
    path = require('path'),
    jwt = require('jsonwebtoken'),
    bcrypt = require('bcrypt'),
    cookieParser = require('cookie-parser');

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

const portNum = 8888;

let database = "tasks";
const mysql = require("mysql2");
const DBconnection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: database,
    password: "er54z4q9"
});

DBconnection.connect((err) => {
    if (err)
        return console.error("Error: " + err.message);
    else
        console.log("(DB)Successfully connected!");
});

/*attaches static files to page*/
app.use(express.static(path.join(__dirname + "/resources")));
/*******************************/

function Task(tId, tName, tStatus, tTerm, tFile)
{
    return{
        tId:tId,
        tName:tName,
        tStatus:tStatus,
        tTerm:setDDMMYYYY(tTerm),
        tFile:tFile
    }

    function setDDMMYYYY(tTerm) 
    {
        let date = new Date(Date.parse(tTerm));
        return (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) +
            "." + (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)) +
            "." + date.getFullYear();
    }
}

let getTasks = function(){
    let sql = `select * from task`; 
    return new Promise(function(resolve, reject){
        DBconnection.query(sql, (err, result)=>{
            if(err) 
                reject(err);
            else
            {
                let loadedTasks = [];
                for(let i=0; i<result.length; i++)
                loadedTasks.push(new Task(  result[i].task_id, 
                                            result[i].task_name, 
                                            result[i].task_status, 
                                            result[i].task_term, 
                                            result[i].task_file));
                resolve(loadedTasks);
            }
        })
    })
}

let getTask = function(id){
    let sql = `select * from task where task_id=?`; 
    return new Promise(function(resolve, reject){
        DBconnection.query(sql, id, (err, result)=>{
            if(err) 
                reject(err);
            else
            {
                
                let loadedTask = new Task(  result[0].task_id, 
                                            result[0].task_name, 
                                            result[0].task_status, 
                                            result[0].task_term, 
                                            result[0].task_file);
                resolve(loadedTask);
            }
        })
    })
}

let updateTask = function(args){
    let sql = 'update task set task_term=?, task_status=?, task_file=? where task_id=?' 
    return new Promise(function(resolve, reject){
        DBconnection.query(sql, args, (err, result)=>{
            if(err) 
                reject(err);
            else
            {
                resolve();
            }
        })
    })
}

let insertTask = function(obj){
    const sql2 = "insert into task(task_name,  task_term) values(?,?)";
    const sql3 = "insert into task(task_name,  task_term, task_file) values(?,?,?)";
    let sql;
    
    if(obj.length === 2) sql=sql2;
    else                 sql=sql3;

    return new Promise(function(resolve, reject)
    {
        DBconnection.query(sql, obj, (err, result)=>{
            if(err) reject(err);
            else    resolve();
        })
    })
}

let deleteTask = function(id){
    const sql="delete from task where task_id=?";
    return new Promise(function(resolve, reject){
        DBconnection.query(sql, id, (err, result)=>{
            if(err) reject(err);
            else    resolve();
        })
    })
}

let addNewUser = function(user){
    const sql="insert into user(uLogin, uPassword) values(?,?)";
    return new Promise(function(resolve, reject){
        DBconnection.query(sql, user, (err, result)=>{
            if(err) reject(err);
            else    resolve();
        })
    })
}

let checkUser = function(userLogin){
    const sql="select * from user where uLogin=?";
    return new Promise(function(resolve, reject){
        DBconnection.query(sql, userLogin, (err, result)=>{
            if(err) reject(err);
            else    resolve(result);
        })
    })
}

//подключение модуля для загрузки клиентских файлов
const uploadingPath = "Z:\\6sem\\SPP\\Lab1\\uploads\\";
const multer = require("multer");
const { request } = require('express');
const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadingPath);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

app.use("/Lab2/uploads", (req, resp) => {
    let filename = req.query.uploadingFile;
    let fpath = uploadingPath + decodeURIComponent(filename);
    resp.sendFile(fpath);
});

app.use(express.static(__dirname));
app.use(multer({ storage: storageConfig }).single("uploadingFile"));

app.get('/lab2', (request, response) => {
    response.sendFile('resources/index.html', { root: __dirname });
})

app.route('/lab2/tasks')
    .get(authToken, (request, response) => {
        getTasks().then((result)=>{
            response.status(200).send(JSON.stringify(result));
        }).catch((err)=>{
            response.status(500).send(err);
        });
    })
    .post(authToken, (request, response) => {
        let args = new Array;
        if (request.body) {
            args.push(request.body.tName);
            args.push(request.body.tTerm);
            if(request.file){
                args.push(request.file.filename);
            }
        
            insertTask(args).then(()=>{
                getTasks().then(result=>{
                    response.status(201).json(result);
                }).catch((err)=>{
                    response.status(500).send(err);
                });
            }).catch((err)=>{
                response.status(500).send(err);
            })
        }
        else response.sendStatus(400);
    })
    .delete(authToken, (request, response) => {
        if (request.query.tId!=='') {
            deleteTask(parseInt(request.query.tId)).then(()=>{
                response.status(200).json({message:'DELETED'});
            }).catch((err)=>{
                response.status(400).json({message:err});
            })
        } else 
            response.status(400).send("Id задачи не определен.");
    });

app.route('/lab2/task')
.put(authToken,(request, response)=>{
    console.log(request.query.tId);
    let args = new Array;
    if (request.body) {
        args.push(request.body.tTerm);
        args.push(request.body.tStatus);
        if(request.file !== undefined){
            args.push(request.file.filename);
        }
        else{
            if(request.body.uploadingFile === 'null'){
                args.push(null);
            }
            else{
                args.push(request.body.uploadingFile);
            }
        }
        args.push(parseInt(request.query.tId));
        
        updateTask(args)
            .then(()=>{
                getTask(parseInt(request.query.tId))
                .then(result=>{response.status(206).json(result)})
                .catch(err=>{console.log(err);response.status(500).send("Разраб говнокодер. "+err)})
            })
            .catch(err=>{console.log(err);response.status(500).send("Разраб говнокодер. "+err)})
    }
    else response.sendStatus(400);
})

//------------------------------------------------------------------------//
//-----------------------------Login/Register-----------------------------//
//------------------------------------------------------------------------//
	
const jsonParser = express.json();

app.post('/lab2/users/reg', jsonParser, (req, res) => {
    try {
        bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
            if (err) {
                console.log(err);
                return res.status(400).json({ message: 'error is occured' })
            }
            else {
                addNewUser([req.body.login, hashedPassword]).then(()=>{
                    res.status(201).json({ message: 'Вы зарегестрированы!' })
                }).catch((err)=>{
                    res.status(400).send(err);
                    console.log(err);
                })
            }
        })
    } catch{
        res.status(500).json({ message: 'Ошибка регистрации.' })
    }
})

app.post('/lab2/users/log', jsonParser, (req, res) => {
    if(req.body){
        checkUser(req.body.login).then((result)=>{
            let user = {
                id: result[0].uId,
                login: result[0].uLogin,
                password: result[0].uPassword
            };
            
            bcrypt.compare(req.body.password, user.password, (err, equal) => {
                if (err) {
                    console.log("err");
                    return res.status(500).send({ message: 'Что-то пошло не так(((' });
                }
                if (equal) {
                    const accessToken = jwt.sign(user, process.env.TOKEN_KEY)
                    const cookieOptions = {
                        httpOnly: true,
                    }
                    res.status(200).cookie('accessToken', accessToken, cookieOptions).json({ message: 'Добро пожаловать!' })
                } else {
                    res.status(401).json({ message: 'Ошибка авторизации!' })
                }
            })
        }).catch((error)=>{
            return res.status(400).json({message:"Пользователь не найден"});
        });
    }else{
        return res.status(400).json({message:"Тело запроса не соответсвует параметрам функции."});
    }
})

function authToken(req, res, next) {
    const token = req.cookies;
    if (token == null) return res.status(401).json({ message: "Null token" })
    jwt.verify(token.accessToken, process.env.TOKEN_KEY, (err, user) => {
        if (err) {
            console.log(err.message);
            return res.status(401).json({ message: "Пользователь не авторизован." });
        }
        req.user = user;
        next();
    })
}

app.listen(portNum, () => {
    console.log("Server started at port ", portNum);
});