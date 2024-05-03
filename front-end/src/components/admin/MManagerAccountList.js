import axios from "axios";
import React, { useEffect, useState } from "react";
import { apiUrl } from "../../contexts/constants";
import { Link } from "react-router-dom";

const MManagerAccountList = () => {
    const [mmanager, setMManager] = useState([]);
    useEffect(() => {
        const fetchAllMManager = async () => {
            try {
                const res = await axios.get(`${apiUrl}/marketingmanager/`);
                setMManager(res.data.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchAllMManager();
    }, []);
    return (
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
                        <button className="btn btn-outline-success" type="submit">
                            Search
                        </button>
                    </form>
                </div>
            </div>
            <table className="table mt-4">
                <thead>
                    <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Email</th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                    {mmanager.map((marketing_manager) => {
                        return (
                            <tr key={marketing_manager._id}>
                                <td scope="row">{marketing_manager.name}</td>
                                <td>
                                     {marketing_manager.user.email}
                                </td>
                                <td>
                                    <Link to={`/detailMManager/${marketing_manager._id}`} type="button" className="btn btn-outline-dark">
                                        Detail
                                    </Link>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default MManagerAccountList;
