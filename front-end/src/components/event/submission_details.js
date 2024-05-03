import styles from "./submission_details.module.css"
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import {apiUrl} from "../../contexts/constants";
import {formatDate} from "../../utils/common";
import {saveAs} from 'file-saver'

const SubmissionDetails = () => {
    const params = useParams()
    const [data, setData] = useState()

    async function getContributionDetail() {
        const response = await axios.get(`${apiUrl}/marketingcoordinator/contributionDetail/${params.id}`)
        setData(response.data.data)
    }

    async function saveContributionDetail() {
        try {
            const response = await axios.put(`${apiUrl}/marketingcoordinator/contributionDetail/${params.id}`, data)
            console.log(response)
        } catch (c) {
            alert(c.response.data.message)
        }

    }

    async function downloadFile() {
        const response = await axios.get(`${apiUrl}/marketingcoordinator/download/${params.id}`,
            {
                responseType: 'arraybuffer'
            })

        let fileName = 'download.zip'
        if (response) {
            const contentDisposition = response.request.getResponseHeader('Content-Disposition')
            console.log(contentDisposition);
            fileName = contentDisposition.split(';')[1]
                .replace("filename=", '')
                .replaceAll('"', '')
        }

        let blob = new Blob([response.data], {
            type: 'application/octet-stream'
        })

        saveAs(blob, fileName)
    }

    useEffect(() => {
        getContributionDetail();
    }, []);
    return (
        <div className={styles.container_submission_detail}>
            <h1 className={styles.title}> Submission's detail</h1>
            <table className={styles.table_submission_list}>
                <tr className={`${styles.table_rows}`}>
                    <th className={styles.th_table_contribution}>Student's name</th>
                    <td>{data && data.student ? data.student.name : <></>}</td>
                </tr>
                <tr className={styles.table_rows}>
                    <th className={styles.th_table_contribution}>Submission Date</th>
                    <td>{data && formatDate(data.date)}</td>
                </tr>
                <tr className={styles.table_rows}>
                    <th className={styles.th_table_contribution}>File Submission</th>
                    <td>
                        <div className={styles.td_filesubmission}>
                            <p className={styles.file_name}>File submission</p>
                            <button className={styles.btn_download} onClick={() => {
                                downloadFile()
                            }}>Download
                            </button>
                        </div>
                    </td>
                </tr>
                <tr className={styles.table_rows}>
                    <th className={styles.th_table_contribution}>Comment</th>
                    <td>
                        <div className={styles.td_filesubmission}>
                            <input style={{width: "50%"}} type="text"
                                   value={data && data.comment ? data.comment : <></>} onChange={(e) => {
                                setData((prev) => {
                                    return {
                                        ...prev,
                                        comment: e.target.value
                                    }
                                })
                            }}/>
                        </div>
                    </td>
                </tr>
                <tr className={styles.table_rows}>
                    <th className={styles.th_table_contribution}>Desicion</th>
                    <td>
                        <select value={data ? data.choosen : ""} onChange={(e) => {
                            setData((prev) => {
                                return {
                                    ...prev,
                                    choosen: e.target.value
                                }
                            })
                        }}>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </td>
                </tr>
            </table>
            <div className={styles.save_sub}>
                <button className={styles.btn_save} onClick={() => {
                    saveContributionDetail()
                }}>Save
                </button>
            </div>
        </div>
    )
}
export default SubmissionDetails;