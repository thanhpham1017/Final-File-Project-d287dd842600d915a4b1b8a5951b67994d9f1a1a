import styles from "./content_guest.module.css";
import {useEffect, useState} from "react";
import axios from "axios";
import {apiUrl} from "../../contexts/constants";
import {useParams} from "react-router-dom";

const ContentGuest = () => {
    const [guestData, setGuestData] = useState();
    const getGuestData = async () => {
        const response = await axios.get(`${apiUrl}/guest/gpage`)
        console.log(response.data);
        setGuestData(response.data);
    };
    useEffect(() => {
        getGuestData();
    }, []);

    return (
        <div className={styles.list_artical}>
            {guestData && guestData.eventData.map((item) => {
                return (
                    <a href={`/guest/guestEventDetail/${item._id}`} className={styles.artical_item}>
                        <img
                            className={styles.img_artical}
                            src="https://w.ladicdn.com/s550x400/616a4856fd53e600396580f1/2022-greenwich-eng-20220525041319.png"
                            alt=""
                        />
                        <span className={styles.artical_name}>{item.requirement}</span>
                    </a>
                )
            })}
        </div>


    )
}
export default ContentGuest;