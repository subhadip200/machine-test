// for content type json

const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());

mongoose.connect('mongodb://localhost:27017/Demo', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));


app.use(bodyParser.json());


const StudentSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  birthdate: { type: Date, required: true },
  residentialAddress: {
    street1: { type: String, required: true },
    street2: { type: String, required: true },
  },
  permanentAddress: {
    street1: { type: String, required: true },
    street2: { type: String, required: true },
  },
  sameAsResidential: { type: Boolean, required: true },
  documentFields: [{
    fileName: { type: String, required: true },
    fileType: { type: String, required: true },
    // file: { type: String }
  }]
});


const StudentModel = mongoose.model("students", StudentSchema);

app.post("/submit-form", async (req, resp) => {
  try {
    console.log(req.body)
    const newStudent = new StudentModel(req.body);
    await newStudent.save();
    resp.send({ message: "Student data saved successfully!" });
  } catch (error) {
    console.error(error);
    resp.status(500).send({ message: "Failed to save student data" });
  }
});
app.listen(3001,()=>{
    console.log('server is running')
})