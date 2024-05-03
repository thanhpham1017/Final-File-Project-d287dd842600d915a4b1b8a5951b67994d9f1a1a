import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { apiUrl } from '../../contexts/constants';
import { Link, useNavigate } from 'react-router-dom';

const Event = () => {

    const [event, setEvent] = useState([])

    useEffect(() => {
        const fetchAllEvent = async () => {
            try {
                const res = await axios.get(`${apiUrl}/event/`);
                setEvent(res.data.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchAllEvent();
    }, [])

    const navigate = useNavigate();
    const addButton = () => {
        navigate('/addEvent');
    };

    const handleDelete = async (id) => {
        try {
            if(window.confirm("Are you sure delete this?")){
                await axios.delete(`${apiUrl}/event/delete/`+id)
                window.location.reload()
            }
        } catch (error) {
            console.log(error)
        }
    }

    // console.log(event)
    return (
        <div className="heading">
                <h1>Event</h1>
                <button
                    className="btn appButton btn-info"
                    type="button"
                    onClick={addButton}
                >
                    Add
                </button>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-4">
                            <form className="d-flex" role="search">
                                <input
                                    className="form-control me-2"
                                    type="search"
                                    placeholder="Search"
                                    aria-label="Search"
                                />
                                <button className="btn btn-outline-success">
                                    Search
                                </button>
                            </form>
                        </div>
                    </div>
                    <table className="table mt-4">
                        <thead>
                        <tr>
                            <th scope="col">Requirement</th>
                            <th scope="col">Deadline 1</th>
                            <th scope="col">Deadline 2</th>
                            <th scope="col">Faculty</th>
                            <th scope="col"></th>
                        </tr>
                        </thead>
                        <tbody>
                        {event.map((event) => {
                            return (
                                <tr key={event._id}>
                                    <td>{event.requirement}</td>
                                    <td>{event.deadline1.split('T')[0]}</td>
                                    <td>{event.deadline2.split('T')[0]}</td>
                                    <td>{event.faculty.name}</td>
                                    <td>
                                        <Link to={`/updateEvent/${event._id}`} type="button" className="btn btn-warning" >
                                            Edit
                                        </Link>
                                        <button type="button" className="btn btn-danger" onClick={() => handleDelete(event._id)}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            </div>
    )
}

export default Event
