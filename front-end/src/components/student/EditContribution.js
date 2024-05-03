import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Button, Col, Row } from 'react-bootstrap'
import { Form } from 'react-bootstrap'
import { apiUrl } from '../../contexts/constants'
import { useNavigate, useParams } from 'react-router-dom'

const EditContribution = () => {

    const {id} = useParams()

    const [submited, setSubmited] = useState({
        filetype: "",
        contribution: "",
    })

    useEffect(() => {
        const fetchContribution = async () => {
            try {
                const res = await axios.get(`${apiUrl}/student/editContribution/`+id);
                // console.log(res.data.data)
                setSubmited({...submited, filetype: res.data.data.filetype, contribution: res.data.data.contribution})
            } catch (error) {
                console.log(error)
            }
            
        }
        fetchContribution()
    }, [])
    // console.log(submited)
    function convertToBase64(e) {
        console.log(e)
        const reader = new FileReader()
        reader.readAsDataURL(e.target.files[0])
        console.log(reader)
        reader.onload = () => {
            // console.log(reader.result)
            const base64result = reader.result.split(',')[1]
            // setFile(base64result)
            submited.contribution = base64result
        }
        reader.onerror = error => {
            console.log(error)
        }
    }

    const handleChange = (e) => {
        setSubmited((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const navigate = useNavigate()
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios
                .put(`${apiUrl}/student/editContribution/`+id, submited)
                .then((res) => console.log(res));
            navigate('/student/event/:id')
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className='container'>
            <h5 style={{textAlign : 'center'}}>Edit Submission</h5>
            <Form className='ms-3'>
                {['checkbox'].map((type) => (
                    <div key={`default-${type}`} className="mb-3">
                    <Form.Check // prettier-ignore
                        type={type}
                        id={`default-${type}`}
                        label={`Agreed to Terms and Conditions`}
                    />
                    </div>
                ))}
            </Form>
            <Row className='ms-2' xs={2} md={4} lg={6}>
                <Col>
                    <Form.Select name='filetype' size="sm" onChange={handleChange}>
                        <option hidden>{submited.filetype}</option>
                        <option value="word">Word</option>
                        <option value="image">Image</option>
                    </Form.Select>
                </Col>
            </Row>
            <br/>
            <Row className='ms-2' xs={2}>
                <Form.Group controlId="formFile">
                    <Form.Control
                        type="file"
                        name="file"
                        onChange={convertToBase64}
                    />
                </Form.Group>
            </Row>
            <Button className='ms-4 mt-5' variant='success' type='submit' onClick={handleUpdate}>Update</Button>
        </div>
    )
}

export default EditContribution
