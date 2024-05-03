import React, { useEffect, useState } from "react";
import { apiUrl } from "../../contexts/constants";
import axios from "axios";

const PersonalProfile = () => {

    const [admin, setAdmin] = useState([])

    useEffect(() => {
        const fetchAdmin = async () => {
            try {
                const res = await axios.get(`${apiUrl}/admin/`);
                // console.log(res.data)
                setAdmin(res.data.data)
            } catch (err) {
                console.log(err);
            }
        };
        fetchAdmin();
    }, []);
    return (
        <div className="container text-center">
            <div className="row">
                <div className="col-8 profile-background">
                    <h1>Profile</h1>
                    {admin.map((admin) => {
                        return <ul type="none" className="profile-background-ul" key={admin._id}>
                            <li>Name: {admin.name}</li>
                            <li>Date of birth: {admin.dob.split('T')[0]}</li>
                            <li>Email: {admin.user.email}</li>
                            <li>Address: {admin.address}</li>
                            <li>Gender: {admin.gender}</li>
                        </ul>
                    })}
                </div>
                <div className="col-4">
                    <img src="./images/ProfilePictuire.png" className="img-thumbnail" alt="..." />
                </div>
            </div>
        </div>
    )
}

export default PersonalProfile;