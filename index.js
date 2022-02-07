import "dotenv/config";
const port = process.env.PORT || 80; 
import express from "express";
import path from "path";
import mongoose from "mongoose";
await mongoose.connect('mongodb://localhost:27017/');

import serverSchema from "./models/server.js";
const models = {
  server: mongoose.model("Server", serverSchema)
};

import webpack from 'webpack';

const compiler = webpack({
  entry: "./client/src/main.js",
  output: {
    filename: './js/main.js',
    path: path.resolve('./client/')
  },
  devtool: 'source-map',
  experiments: {
    topLevelAwait: true
  },
});

compiler.watch({
  aggregateTimeout: 300,
  poll: undefined
}, (err, stats) => {
  if(stats.hasErrors()) console.log(stats.compilation.errors);
});

const app = express();
app.use(express.static("./client"));
app.get('/coffee',(req, res)=>{res.sendStatus(418)});

import api from "./controllers/api.js";
app.use('/servers', api(models));

import client from "./controllers/client.js";
app.use('/', client);

const server = app.listen(port, ()=>{
  console.log(`Listening on port: ${server.address().port}`)
});

import getServers from "./controllers/getServers.js";
async()=>{getServers(models)};
const getServerLoop = setInterval(async()=>{
  getServers(models)
}, 2 * 60 * 1000);