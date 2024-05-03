import styles from "./card.module.css";
import {Link} from "react-router-dom";

const Card = (props) => {
    console.log(props.cardData);
    return (

        <Link to={`/marketing-coordinator/eventDetail/${props.cardData._id}`} className={styles.artical_item}>
            <img
                className={styles.img_artical}
                src="https://www.shutterstock.com/shutterstock/photos/1972527140/display_1500/stock-vector-gg-logo-unique-for-different-projects-1972527140.jpg"
                alt=""
            />
            <p className={styles.artical_name}> {props.cardData.requirement}</p>
        </Link>
    );
};

export default Card;
