import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/esm/Button'
import FloatingLabel from 'react-bootstrap/esm/FloatingLabel'
import { Form } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { apiUrl } from '../../contexts/constants'

const UpdateFaculty = () => {

    const {id} = useParams();

    useEffect(() => {
        const fetchFaculty = async () => {
            try {
                const res = await axios.get(`${apiUrl}/faculty/edit/`+id)
                // console.log(res)
                setFaculty({...faculty, name: res.data.data.name, description: res.data.data.description})
            } catch (error) {
                console.log(error)
            }
        }
        fetchFaculty();
    }, [])

    const [faculty, setFaculty] = useState({
        name: "",
        description: "",
    })
    // console.log(faculty)
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFaculty((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${apiUrl}/faculty/edit/`+id, faculty)
            console.log(res)
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
                            name="name"
                            onChange={handleChange}
                            value={faculty.name}
                        />
                    </FloatingLabel>
                    <FloatingLabel label="Description" className="mb-3">
                        <Form.Control
                            type="text"
                            placeholder="Description"
                            name="description"
                            onChange={handleChange}
                            value={faculty.description}
                        />
                    </FloatingLabel>

                    <Button type='submit' variant='info' onClick={handleUpdate}>
                        Update
                    </Button>
                </Form>
            </div>
        </div>
  )
}

export default UpdateFaculty
