import styles from "./content_event.module.css";
import axios from "axios";
import {apiUrl} from "../../contexts/constants";
import {useEffect, useState} from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Button, Card } from "react-bootstrap";

const StudentEvent = () => {
    const [eventData, setEventData] = useState([]);
    const getAllEvent = async () => {
        try {
            const response = await axios.get(`${apiUrl}/student/facultypage`)
            setEventData(response.data.eventData);
            console.log(response.data.eventData)
        } catch (error) {
            console.log(error)
        }
        
    }
    useEffect(() => {
        getAllEvent()
    }, []);

    const navigate = useNavigate()

    console.log(eventData)
    return (
        <div className={styles.content_event}>
            <h1 className={styles.my_event}>My Event</h1>
            <div className={styles.list_artical}>
                {eventData.map((eventData) => {
                    return <Card style={{ width: '18rem' }}>
                                <Card.Img variant="top" src="https://bizflyportal.mediacdn.vn/bizflyportal/2870/13429/2023/07/28/22/01/case_study_marketing-16905348885959.jpg" />
                                <Card.Body>
                                <Card.Title>{eventData.requirement}</Card.Title>
                                <br/>
                                <Link to={`/studentPage/event-detail/${eventData._id}`} className="btn btn-primary" type="button">Detail</Link>
                                </Card.Body>
                            </Card>
                    })}
            </div>
        </div>
    );
};
export default StudentEvent;
