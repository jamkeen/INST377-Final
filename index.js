// For nodejs only
/*const path = require('path')

const app = express();

app.set('INST377', path.join(__dirname, 'INST377'))
app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    res.render("final_home");
});

import fs from "fs";
await fetch("https://api.trace.moe/search", {
method: "POST",
body: fs.readFileSync("demo.jpg"),
headers: { "Content-type": "image/jpeg" },
}).then((e) => e.json());
*/
//import express from 'express'
//import cors from 'cors'
//import multer from 'multer'

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const formidable = require('formidable');
const path = require("path");

var http = require('http');
var fs = require('fs');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "screenshots");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname /*+ "-" + Date.now()*/ + ".jpg");
  }
});

const upload = multer({
	storage: storage,
	limits: { fileSize: 10000000 },
	fileFilter: function (req, file, cb) {
		const filetypes = /jpeg|jpg|png/;
		const mimetype = filetypes.test(file.mimetype);

		const extname = filetypes.test(
			path.extname(file.originalname).toLowerCase()
		);

		if (mimetype && extname) {
			return cb(null, true);
		}

		cb(
			"Error: File upload only supports the " +
				"following filetypes - " +
				filetypes
		);
	}

	// imageToUpload is the name of file attribute
}).single("imageToUpload");

var server = http.createServer(function (req, res) {
  console.log('request was made: ' + req.url);
  res.writeHead(200, {'Content-Type': 'text/html'});
  var myReadStream = fs.createReadStream(__dirname + '/final_home.html', 'utf8');
  myReadStream.pipe(res);
  if (req.url == '/fileupload') {
    try {
      upload(req, res, function (err) {
        console.log("Success, Image uploaded!");
        fetch("https://api.trace.moe/search", {
          method: "POST",
          body: fs.readFileSync(path.join(__dirname, "screenshots/imageToUpload.jpg")),
          headers: { "Content-type": "image/jpeg" },
        }).then((fetchRes) => fetchRes.json())
        .then((data) => {
          //res.write(200, { "Content-Type": "application/json" });
          res.end(`
            <h1>${JSON.stringify(data)}</h1>
            `)
        })
      })
    } catch (err) {
      console.log(err);
    }
  }
});

server.listen(8080, '127.0.0.1');
console.log('Now listening to port 8080');
