import React, { useEffect, useState } from 'react'
import { apiUrl } from '../../contexts/constants';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Guest = () => {
    const [guest, setGuest] = useState([])

    useEffect(() => {
        const fetchAllGuest = async () => {
            try {
                const res = await axios.get(`${apiUrl}/guest/`);
                setGuest(res.data.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchAllGuest();
    }, []);
    const handleDelete = async (id) => {
        try {
            if(window.confirm("Are you sure delete this?")){
                const res = await axios.get(`${apiUrl}/guest/delete/`+id)

                window.location.reload()
            }
        } catch (error) {
            console.log(error)
        }
    }

    const navigate = useNavigate();
    const addButton = () => {
        navigate('/addGuest');
    };
    return (
        <div className="heading">
            <h1>Guest</h1>
            <button className="btn appButton btn-info" type="button" onClick={addButton}>Add</button>
            <div className='container'>
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
                        <th scope="col">Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Faculty</th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                    {guest.map((guest) => {
                        return <tr key={guest._id}>
                            <td scope="row">{guest.name}</td>
                            <td>
                                {guest.user.email}
                            </td>
                            <td>{guest.faculty.name}</td>
                            <td>
                                <Link to={`/updateGuest/${guest._id}`} type="button" className="btn btn-warning" >
                                    Edit
                                </Link>
                                <button type="button" className="btn btn-danger" onClick={() => handleDelete(guest._id)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    })}

                </tbody>
            </table>
            </div>
        </div>
    )
}

export default Guest
