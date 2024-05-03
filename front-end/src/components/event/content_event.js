import Card from "../card/card";
import styles from "./content_event.module.css";
import axios from "axios";
import {apiUrl} from "../../contexts/constants";
import {useEffect, useState} from "react";

const ContentEvent = () => {
    const [eventData, setEventData] = useState([]);
    const getAllEvent = async () => {
        const response = await axios.get(`${apiUrl}/marketingcoordinator/facultypage`)
        setEventData(response.data.eventData);
        console.log(response.data.eventData)
    }
    useEffect(() => {
        getAllEvent()
    }, []);
    return (
        <div className={styles.content_event}>
            <h1 className={styles.my_event}>My Event</h1>
            <div className={styles.list_artical}>
                {eventData &&
                    eventData.map((item) => {
                        return <Card cardData={item} key={item._id}/>;
                    })}
            </div>
        </div>
    );
};
export default ContentEvent;
