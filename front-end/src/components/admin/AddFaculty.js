import React, { useState } from 'react'
import Button from 'react-bootstrap/esm/Button'
import FloatingLabel from 'react-bootstrap/esm/FloatingLabel'
import { Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { apiUrl } from '../../contexts/constants'

const AddFaculty = () => {
    const [faculty, setFaculty] = useState({
        name: "",
        description: "",
    })

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFaculty((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios
                .post(`${apiUrl}/faculty/add`, faculty)
                .then((res) => console.log(res));
            navigate("/facultyList");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className='d-flex vh-100 justify-content-center align-item-center'>
            <div className='w-50 bg-white round p-3'>
                <Form>
                    <h2>Add Faculty</h2>
                    <FloatingLabel label="Faculty Name" className="mb-3">
                        <Form.Control
                            type="text"
                            placeholder="Faculty Name"
                            onChange={handleChange}
                            name="name"
                        />
                    </FloatingLabel>
                    <FloatingLabel label="Description" className="mb-3">
                        <Form.Control
                            type="text"
                            placeholder="Description"
                            onChange={handleChange}
                            name="description"
                        />
                    </FloatingLabel>

                    <Button type='submit' variant='info' onClick={handleSubmit}>
                        Add
                    </Button>
                </Form>
            </div>
        </div>
    )
}

export default AddFaculty
