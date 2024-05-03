import styles from "../contribution/content_contribution.module.css"
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import {apiUrl} from "../../contexts/constants";

const ContentArticalDetail = () => {
    const params = useParams()
    const [data, setData] = useState()

    async function getArticalDetail() {
        const response = await axios.get(`${apiUrl}/guest/contributionDetail/${params._id}`)
        setData(response.data)
        console.log(response.data)
    }

    useEffect(() => {
        getArticalDetail()
    }, []);

    return (
        <div>
            <h1 className={styles.title}> Submission's detail</h1>
            <div className={styles.table_submissionDetail}>
                <table className={styles.table_contribution_list}>
                    <tr className={`${styles.table_rows}`}>
                        <th className={styles.th_table_contribution}>Student's name</th>
                        <td></td>
                    </tr>
                    <tr className={styles.table_rows}>
                        <th className={styles.th_table_contribution}>Email</th>
                        <td></td>
                    </tr>
                    <tr className={styles.table_rows}>
                        <th className={styles.th_table_contribution}>Faculty</th>
                        <td></td>
                    </tr>
                    <tr className={styles.table_rows}>
                        <th className={styles.th_table_contribution}>Submission Date</th>
                        <td></td>
                    </tr>
                    <tr className={styles.table_rows}>
                        <th className={styles.th_table_contribution}>File submission</th>
                        <td>
                            <div className={styles.td_filesubmission}>
                                <span className={styles.file_name}>student_word.docx</span>
                                <button className={styles.btn_download}>Download</button>
                            </div>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
    )
}
export default ContentArticalDetail