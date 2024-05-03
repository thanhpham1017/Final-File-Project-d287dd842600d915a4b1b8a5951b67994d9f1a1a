import React, { useEffect, useState } from 'react'
import { apiUrl } from '../../contexts/constants';
import axios from 'axios';
import { Button, Col, FloatingLabel, Form, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const AddEvent = () => {

    function getTodayDate() {
        const today = new Date();
        const month = today.getMonth() + 1;
        const year = today.getFullYear();
        const date = today.getDate();
        return `${year}-${month}-${date}`;
    }

    const [event, setEvent] = useState({
        requirement: "",
        deadline1: "",
        deadline2: "",
        faculty: "",
    })

    const [faculty, setFaculty] = useState([]);

    useEffect(() => {
        const fetchFaculty = async () => {
            try {
                const res = await axios.get(`${apiUrl}/faculty/`);
                // console.log(res.data);
                setFaculty(res.data.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchFaculty();
    }, []);

    const handleChange = (e) => {
        setEvent((prev) => ({...prev, [e.target.name]: e.target.value}))
    }

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${apiUrl}/event/add`, event).then((res) => console.log(res))
            navigate('/eventList')
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className='d-flex vh-100 justify-content-center align-item-center'>
            <div className='w-50 bg-white round p-3'>
                <Form>
                    <h2>Add Event</h2>
                    <FloatingLabel label="Requirement" className="mb-3">
                        <Form.Control
                            type="text"
                            placeholder="Requirement"
                            onChange={handleChange}
                            name="requirement"
                        />
                    </FloatingLabel>
                    <Row className="mb-3">
                        <Form.Group as={Col}>
                            <Form.Label>Deadline 1</Form.Label>
                            <br />
                            <Form.Control type="date" name="deadline1" onChange={handleChange} />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Deadline 2</Form.Label>
                            <br />
                            <Form.Control type="date" name="deadline2" onChange={handleChange} />
                        </Form.Group>
                    </Row>
                    <Form.Select
                        aria-label="Default select example"
                        className="mb-3"
                        onChange={handleChange}
                        name="faculty"
                    >
                        <option>-Choose Faculty-</option>
                        {faculty.map((faculty) => {
                            return (
                                <option value={faculty._id} key={faculty._id}>
                                    {faculty.name}
                                </option>
                            );
                        })}
                    </Form.Select>
                    <Button type='submit' variant='info' onClick={handleSubmit}>
                        Add
                    </Button>
                </Form>
            </div>
        </div>
    )
}

export default AddEvent
