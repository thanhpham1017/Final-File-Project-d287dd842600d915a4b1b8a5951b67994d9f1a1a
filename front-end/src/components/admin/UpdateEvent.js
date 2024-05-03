import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, Col, FloatingLabel, Form, Row } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { apiUrl } from '../../contexts/constants';

const UpdateEvent = () => {

    const {id} = useParams()

    const [eventFaculty, setEventFaculty] = useState()

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await axios.get(`${apiUrl}/event/edit/`+id);
                setEvent({...event, requirement: res.data.event.requirement, deadline1: res.data.event.deadline1, 
                    deadline2: res.data.event.deadline2, faculty: res.data.event.faculty._id});
                setEventFaculty(res.data.event.faculty.name)
            } catch (err) {
                console.log(err);
            }
        }
        fetchEvent()
    }, [])

    
    const [event, setEvent] = useState({
        requirement: "",
        deadline1: "",
        deadline2: "",
        faculty: "",
    })
    
    const handleChange = (e) => {
        setEvent((prev) => ({...prev, [e.target.name]: e.target.value}))
    }

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

    const navigate = useNavigate()

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(`${apiUrl}/event/edit/`+id, event)
            console.log(res)
            navigate('/eventList')
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='d-flex vh-100 justify-content-center align-item-center'>
            <div className='w-50 bg-white round p-3'>
                <Form>
                    <h2>Update Event</h2>
                    <FloatingLabel label="Requirement" className="mb-3">
                        <Form.Control
                            type="text"
                            placeholder="Requirement"
                            onChange={handleChange}
                            name="requirement"
                            value={event.requirement}
                        />
                    </FloatingLabel>
                    <Row className="mb-3">
                        <Form.Group as={Col}>
                            <Form.Label>Deadline 1</Form.Label>
                            <br />
                            <Form.Control type="date" name="deadline1" onChange={handleChange} value={event.deadline1.split("T")[0]}/>
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Deadline 2</Form.Label>
                            <br />
                            <Form.Control type="date" name="deadline2" onChange={handleChange} value={event.deadline2.split("T")[0]}/>
                        </Form.Group>
                    </Row>
                    <Form.Select
                        aria-label="Default select example"
                        className="mb-3"
                        onChange={handleChange}
                        name="faculty"
                    >
                        <option hidden>{eventFaculty}</option>
                        {faculty.map((faculty) => {
                            return (
                                <option value={faculty._id} key={faculty._id}>
                                    {faculty.name}
                                </option>
                            );
                        })}
                    </Form.Select>
                    <Button type='submit' variant='info' onClick={handleUpdate}>
                        Update
                    </Button>
                </Form>
            </div>
        </div>
    )
}

export default UpdateEvent
