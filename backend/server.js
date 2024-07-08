const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require('cors');
const dotenv = require("dotenv");
const path  = require('path')

dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());



mongoose.connect(process.env.DBURI);

const db = mongoose.connection;
db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

db.once('open', () => {
  console.log('Connected to MongoDB');
});


const ParticipantRouter = require("./routes/ParticipantRoutes")
app.use("/participant", ParticipantRouter)

const FormRouter = require("./routes/FormRoutes")
app.use("/form", FormRouter)

const server = app.listen(process.env.PORT, () => {
  console.log(`server started on port ${process.env.PORT}`);
})