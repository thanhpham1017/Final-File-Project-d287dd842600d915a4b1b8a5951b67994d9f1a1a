import styles from "./event_details.module.css"
import {Link, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import {apiUrl} from "../../contexts/constants";
import {formatDate} from "../../utils/common";

const EventDetails = () => {
    const params = useParams()
    const [eventData, setEventData] = useState()

    async function getEventDetail() {
        const response = await axios.get(`${apiUrl}/marketingcoordinator/eventDetail/${params.id}`)
        setEventData(response.data)
        console.log(response.data)
    }

    useEffect(() => {
        getEventDetail()
    }, []);

    return (
        <div className={styles.container_event}>
            <div className={styles.event_details}>
                <div className={styles.header_event_details}>
                    <h1>Event Details</h1>
                </div>
                <div className={styles.content_event_details}>
                    <h3>Event name: {eventData && eventData.eventData.requirement}</h3>
                    <h3>Deadline 1: {eventData && formatDate(eventData.eventData.deadline1)}</h3>
                    <h3>Deadline 2: {eventData && formatDate(eventData.eventData.deadline2)}</h3>
                </div>
                <hr/>
            </div>
            <div className={styles.submission}>
                <div className={styles.header_submission}>
                    <h1> Submission</h1>
                </div>
                <div className={styles.table_submission}>
                    <table className={styles.table_submission_list}>
                        <thead>
                        <tr className={styles.table_rows}>
                            <th className={styles.title_table_1}>Student's Name</th>
                            <th className={styles.title_table_1}>Date</th>
                            <th className={styles.title_table_1}>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            eventData && eventData.contributionList.map((item, index) => {
                                if (item.choosen === "Yes") {
                                    return (
                                        <tr className={styles.table_rows}>
                                            <td>{item.student ? item.student.name : <></>}</td>
                                            <td>{item.date ? formatDate(item.date) : <></>}</td>
                                            <td>
                                                <Link to={`/marketing-coordinator/submissionDetail/${item._id}`}>
                                                    <button className={styles.btn}>View</button>
                                                </Link>
                                            </td>
                                        </tr>
                                    )
                                }
                            })
                        }
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    )

}
export default EventDetails