import React,{useState} from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';


const index = () => {



  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    birthdate: '',
    residentialAddress: { street1: '', street2: '' },
    permanentAddress: { street1: '', street2: '' },
    sameAsResidential: false,
    documentFields: [
      { id: 1, fileName: '', fileType: 'Select File Type' },
      { id: 2, fileName: '', fileType: 'Select File Type' }
    ]
  });

  // Handling simple and nested input changes
  const handleInputChange = (event, category = null) => {
    const { name, value } = event.target;
    if (category) {
      setFormData(prevState => ({
        ...prevState,
        [category]: {
          ...prevState[category],
          [name]: value
        }
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };
  const handleFileChange = (fieldId, file) => {
    const updatedFields = formData.documentFields.map((field) => {
      if (field.id === fieldId) {
        return { ...field, file: file }; // Store the file object in the state
      }
      return field;
    });
  
    setFormData({ ...formData, documentFields: updatedFields });
  };
  const handleCheckboxChange = (e) => {
    const { checked } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      sameAsResidential: checked,
      permanentAddress: checked ? { ...prevFormData.residentialAddress } : { street1: '', street2: '' }
    }));
  };

  const handleFileNameChange = (id, value) => {
    // Update the fileName for the specific document field based on its id
    const updatedFields = formData.documentFields.map(field => {
      if (field.id === id) {
        return { ...field, fileName: value };
      }
      return field;
    });
    setFormData({ ...formData, documentFields: updatedFields });
  };
  
// Update document fields
const handleFileTypeChange = (id, value) => {
  const updatedFields = formData.documentFields.map(field => {
    if (field.id === id) {
      return { ...field, fileType: value };
    }
    return field;
  });
  setFormData({ ...formData, documentFields: updatedFields });
};

const addMoreDocs = () => {
  const newField = { id: formData.documentFields.length + 1, fileName: '', fileType: 'Select File Type' };
  setFormData({ ...formData, documentFields: [...formData.documentFields, newField] });
};

const deleteDoc = (id) => {
  if (formData.documentFields.length > 2) {
    setFormData({
      ...formData,
      documentFields: formData.documentFields.filter(field => field.id !== id)
    });
  }
};

const getFileAcceptType = (fileType) => {
  switch (fileType) {
    case 'Image': return 'image/*';
    case 'PDF': return '.pdf';
    default: return '*';
  }
};

// Submit form data


const calculateAge = (birthdate) => {
  const birthday = new Date(birthdate);
  const today = new Date();
  let age = today.getFullYear() - birthday.getFullYear();
  const m = today.getMonth() - birthday.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthday.getDate())) {
    age--;
  }
  return age;
};

const validateForm = () => {
  // Check for empty mandatory fields
  if (!formData.firstName || !formData.lastName || !formData.email || !formData.birthdate ||
    !formData.residentialAddress.street1 || !formData.residentialAddress.street2 ||
    (!formData.sameAsResidential && (!formData.permanentAddress.street1 || !formData.permanentAddress.street2))) {
    alert("Please fill all mandatory fields.");
    return false;
  }

  // Validate age
  if (calculateAge(formData.birthdate) < 18) {
    alert("Minimum age should be 18 years.");
    return false;
  }

  // Validate file upload
  const filledDocuments = formData.documentFields.filter(field => field.file);
  if (filledDocuments.length < 2) {
    alert("At least two files should be uploaded.");
    return false;
  }

  return true;
};

// const handleSubmit = async (event) => {
//   event.preventDefault();

//   if (validateForm()) {
//     console.log('Form Data:', formData);

//     try {
//       // Define the API endpoint
//       const endpoint = 'http://localhost:3001/submit-form';
//       // Make a POST request to the backend
//       const response = await fetch(endpoint, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });

//       // Check if the request was successful
//       if (response.ok) {
//         const result = await response.json();
//         console.log(result.message);
//         // Handle success (e.g., showing a success message, clearing the form, etc.)
//         alert('Form submitted successfully!');
//       } else {
//         // Handle HTTP errors
//         console.error('Failed to submit form:', response.status);
//         alert('Failed to submit form. Please try again.');
//       }
//     } catch (error) {
//       // Handle network errors
//       console.error('Network error:', error);
//       alert('Network error. Please try again.');
//     }
//   }
// };

const handleSubmit = async (event) => {
  event.preventDefault();

  if (validateForm()) {
    console.log('Form Data:', formData);

  
    const formDataToSend = new FormData();


    formDataToSend.append('firstName', formData.firstName);
    formDataToSend.append('lastName', formData.lastName);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('birthdate', formData.birthdate);
    formDataToSend.append('residentialAddress[street1]', formData.residentialAddress.street1);
    formDataToSend.append('residentialAddress[street2]', formData.residentialAddress.street2);
    formDataToSend.append('permanentAddress[street1]', formData.permanentAddress.street1);
    formDataToSend.append('permanentAddress[street2]', formData.permanentAddress.street2);
    formDataToSend.append('sameAsResidential', formData.sameAsResidential);

    // Append files
    formData.documentFields.forEach((field, index) => {
      if (field.file) {
        formDataToSend.append(`documentFields[${index}][fileName]`, field.fileName);
        formDataToSend.append(`documentFields[${index}][fileType]`, field.fileType);
        formDataToSend.append(`documentFields[${index}][file]`, field.file);
      }
    });

    try {
   
      const endpoint = 'http://localhost:3001/submit-form';
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result.message);
        alert('Form submitted successfully!');
      } else {
        console.error('Failed to submit form:', response.status);
        alert('Failed to submit form. Please try again.');
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Network error. Please try again.');
    }
  }
};






  return (
    <>
    <Container>
    <Form className="cu-form" onSubmit={handleSubmit}>
    <Row className="mb-3">
          <Form.Group as={Col} controlId="formGridFirstName">
            <Form.Label>First Name<span>*</span></Form.Label>
            <Form.Control type="text" name="firstName" placeholder="Enter First Name" value={formData.firstName} onChange={handleInputChange} />
          </Form.Group>

          <Form.Group as={Col} controlId="formGridLastName">
            <Form.Label>Last Name<span>*</span></Form.Label>
            <Form.Control type="text" name="lastName" placeholder="Enter Last Name" value={formData.lastName} onChange={handleInputChange} />
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group as={Col} controlId="formGridEmail">
            <Form.Label>Email<span>*</span></Form.Label>
            <Form.Control 
              type="email" 
              name="email" 
              placeholder="Enter email" 
              value={formData.email} 
              onChange={handleInputChange} 
            />
          </Form.Group>

          <Form.Group as={Col} controlId="formGridBirthdate">
            <Form.Label>Date Of Birth<span>*</span></Form.Label>
            <Form.Control 
              type="date" 
              name="birthdate" 
              value={formData.birthdate} 
              onChange={handleInputChange} 
            />
          </Form.Group>
        </Row>

    
        <Row className="mb-3">
          <h5>Residential Address</h5>
          <Form.Group as={Col} controlId="formGridResidentialStreetOne">
            <Form.Label>Street 1<span>*</span></Form.Label>
            <Form.Control 
              type="text" 
              name="street1" 
              value={formData.residentialAddress.street1} 
              onChange={(e) => handleInputChange(e, 'residentialAddress')} 
            />
          </Form.Group>

          <Form.Group as={Col} controlId="formGridResidentialStreetTwo">
            <Form.Label>Street 2<span>*</span></Form.Label>
            <Form.Control 
              type="text" 
              name="street2" 
              value={formData.residentialAddress.street2} 
              onChange={(e) => handleInputChange(e, 'residentialAddress')} 
            />
          </Form.Group>
        </Row>


        <Form.Group className="mb-3" id="formGridCheckbox">
  <Form.Check 
    type="checkbox" 
    label="Same as Residential Address" 
    checked={formData.sameAsResidential} 
    onChange={handleCheckboxChange} 
  />
</Form.Group>

<Row className="mb-3">
  <h5>Permanent Address</h5>
  <Form.Group as={Col} controlId="formGridPermanentStreetOne">
    <Form.Label>
      Street 1{!formData.sameAsResidential && <span>*</span>}
    </Form.Label>
    <Form.Control 
      type="text" 
      name="street1" 
      value={formData.permanentAddress.street1} 
      onChange={(e) => handleInputChange(e, 'permanentAddress')} 
      disabled={formData.sameAsResidential}
    />
  </Form.Group>

  <Form.Group as={Col} controlId="formGridPermanentStreetTwo">
    <Form.Label>
      Street 2{!formData.sameAsResidential && <span>*</span>}
    </Form.Label>
    <Form.Control 
      type="text" 
      name="street2" 
      value={formData.permanentAddress.street2} 
      onChange={(e) => handleInputChange(e, 'permanentAddress')} 
      disabled={formData.sameAsResidential} 
    />
  </Form.Group>
</Row>


      <h5>Upload Document</h5>
      {formData.documentFields.map((field, index) => (
        <Row key={field.id} className="mb-3">
          <Col>
            <Form.Group controlId={`formGridFileName-${field.id}`}>
              <Form.Label>FileName<span>*</span></Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Enter File Name" 
                value={field.fileName} 
                onChange={(e) => handleFileNameChange(field.id, e.target.value)} />              
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId={`formGridFileType-${field.id}`}>
              <Form.Label>FileType<span>*</span></Form.Label>
              <Form.Select 
                value={field.fileType} 
                onChange={(e) => handleFileTypeChange(field.id, e.target.value)}>
                <option>Select File Type</option>
                <option value="Image">Image</option>
                <option value="PDF">PDF</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId={`formGridUpload-${field.id}`}>
              <Form.Label>Upload Document<span>*</span></Form.Label>
              <Form.Control 
                type="file" 
                accept={getFileAcceptType(field.fileType)} 
                onChange={(e) => handleFileChange(field.id, e.target.files[0])} />
            </Form.Group>
          </Col>
          <Col>
            {index > 0 && (
              <div style={{ display: "flex", alignItems: 'flex-end', height: '100%' }}>
                <Button variant="danger" onClick={() => deleteDoc(field.id)} disabled={formData.documentFields.length <= 2}>Delete</Button>
              </div>
            )}
            {index === 0 && (
              <div style={{ display: "flex", alignItems: 'flex-end', height: '100%' }}>
                <Button onClick={addMoreDocs}>Click Here to Upload More Docs</Button>
              </div>
            )}
          </Col>
        </Row>
      ))}

      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
    </Container>
    </>
  )
}

export default index
