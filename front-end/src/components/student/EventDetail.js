import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { apiUrl } from '../../contexts/constants'
import { Button, Col, Form, Row } from 'react-bootstrap'

const StudentEventDetail = () => {

    const [values, setValues] = useState({
        requirement: "",
        deadline1: "",
        deadline2: "",
    })

    const [file, setFile] = useState()

    const [contribution, setContribution] = useState([])
    
    const [submited, setSubmited] = useState({
        filetype: "",
        contribution: "",
    })

    const {id} = useParams()
    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await axios.get(`${apiUrl}/student/submitContribution/`+id);
                setValues({...values, requirement: res.data.data.requirement, deadline1: res.data.data.deadline1, deadline2: res.data.data.deadline2})
            } catch (error) {
                console.log(error)
            }
            
        }
        fetchEvent()
    }, [])

    useEffect(() => {
        const fetchContribution = async () => {
            try {
                const res = await axios.get(`${apiUrl}/student/eventDetail/`+id);
                console.log(res.data.contributionList)
                setContribution(res.data.contributionList)
            } catch (error) {
                console.log(error)
            }
        }
        fetchContribution()
    }, [])
    const handleChange = (e) => {
        setSubmited((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    function convertToBase64(e) {
        console.log(e)
        const reader = new FileReader()
        reader.readAsDataURL(e.target.files[0])
        console.log(reader)
        reader.onload = () => {
            // console.log(reader.result)
            const base64result = reader.result.split(',')[1]
            setFile(base64result)
            submited.contribution = base64result
        }
        reader.onerror = error => {
            console.log(error)
        }
    }
    // console.log(submited)


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios
                .post(`${apiUrl}/student/submitContribution/`+id, submited)
                .then((res) => console.log(res));
            window.location.reload()
        } catch (error) {
            console.log(error);
        }
    };

    const handleDelete = async (i) => {
        try {
            if(window.confirm("Are you sure delete this?")){
                const res = await axios.delete(`${apiUrl}/student/deleteContribution/`+i)
                window.location.reload()
            }
        } catch (error) {
            console.log(error)
        }
    }


    // console.log(submited)
    // console.log(values)
    return (
        <div className='container'>
            <h5 style={{textAlign : 'center'}}>Event's Information</h5>
            <ul type='none'>
                <li>Requirement: {values.requirement}</li>
                <li>Deadline 1: {values.deadline1.split('T')[0]}</li>
                <li>Deadline 2: {values.deadline2.split('T')[0]}</li>
            </ul>
            <br/>
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
                        <option hidden>File type</option>
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
            <Button className='ms-4 mt-5' variant='success' type='submit' onClick={handleSubmit}>Submit</Button>
            <br/>
            <br/>
            <h5 style={{textAlign : 'center'}}>Submisson list</h5>
            <br/>
            <br/>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">Choosen</th>
                        <th scope="col">Comment</th>
                        <th scope="col">Date</th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                    {contribution.map((contribution) => {
                        return (
                            <tr key={contribution._id}>
                                <th scope="col">{contribution.choosen}</th>
                                <th scope="col">{contribution.comment}</th>
                                <th scope="col">{contribution.date.split('T')[0]}</th>
                                <td>
                                    <Link to={`/studentPage/edit-contribution/${contribution._id}`} type="button" className="btn btn-warning">
                                        Edit
                                    </Link>
                                    <Button type="button" className="btn btn-danger" onClick={() => handleDelete(contribution._id)}>
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
        
        
    )
}

export default StudentEventDetail
