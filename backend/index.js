const express = require('express');
const mongoose = require('mongoose')
const multer = require('multer');
const cors = require('cors');

const upload = multer();
const app = express();
app.use(cors());

mongoose.connect('mongodb://localhost:27017/Demo', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

  const documentFieldSchema = new mongoose.Schema({
    fileName: String,
    fileType: String,
    file: Buffer, 
  });
  
  const addressSchema = new mongoose.Schema({
    street1: String,
    street2: String,
  });
  
  const StudentSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    birthdate: Date,
    residentialAddress: addressSchema,
    permanentAddress: addressSchema,
    sameAsResidential: Boolean,
    documentFields: [documentFieldSchema],
  });



const StudentModel = mongoose.model("students", StudentSchema);


app.post('/submit-form', upload.any(), async (req, res) => {
    try {
      // Extract text fields from req.body and files from req.files
      console.log(req.body)
      const { body, files } = req;
      console.log(body,files)
  
     
      const formData = {
        ...body,
        documentFields: files.map(file => ({
          fileName: file.originalname,
          fileType: file.mimetype,
          file: file.buffer, 
        }))
      };
  
    
  
      const userForm = new StudentModel(formData);
      await userForm.save();
  
      res.json({ message: 'Form submitted successfully!' });
    } catch (error) {
      console.error('Failed to submit form:', error);
      res.status(500).json({ message: 'Failed to submit form. Please try again.' });
    }
  });
  

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));