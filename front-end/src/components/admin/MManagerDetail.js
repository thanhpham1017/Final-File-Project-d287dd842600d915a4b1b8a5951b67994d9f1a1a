import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/Row";
import FloatingLabel from "react-bootstrap/esm/FloatingLabel";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { apiUrl } from "../../contexts/constants";
import { useNavigate, useParams } from "react-router-dom";

const MManagerDetail = () => {

    const {id} = useParams();
    // console.log(id)
    const [mmanager, setMManager] = useState([])

    useEffect(() => {
        const fetchMManager = async () => {
            try {
                const res = await axios.get(`${apiUrl}/marketingmanager/edit/`+id)
                setImage(res.data.marketingmanager.image)
                setValues({...values, email: res.data.user.email, name: res.data.marketingmanager.name, gender: res.data.marketingmanager.gender,
                            address: res.data.marketingmanager.address, image: res.data.marketingmanager.image, dob: res.data.marketingmanager.dob})
            } catch (error) {
                console.log(error)
            }
        }
        fetchMManager();
    }, [])

    // console.log(student)
    const [values, setValues] = useState({
        email: "",
        password: "",
        name: "",
        dob: "",
        gender: "",
        address: "",
        faculty: "",
        image: "",
    });

    const [image, setImage] = useState();

    const navigate = useNavigate();

    const handleChange = (e) => {
        setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    function convertToBase64(e) {
        console.log(e)
        const reader = new FileReader()
        reader.readAsDataURL(e.target.files[0])
        reader.onload = () => {
            console.log(reader.result.base64)
            const base64result = reader.result.split(',')[1]
            setImage(base64result)
            values.image = base64result
        }
        reader.onerror = error => {
            console.log(error)
        }
    }

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${apiUrl}/marketingmanager/edit/`+id, values)
            console.log(res)
            navigate('/mmanager')
        } catch (error) {
            console.log(error)
        }
    }

    const handleDelete = async () => {
        try {
            if(window.confirm("Are you sure delete this?")){
                const res = await axios.get(`${apiUrl}/marketingmanager/delete/`+id)
                navigate('/mmanager')
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="container add">
            <h1>Marketing Manager Detail</h1>

            <Form>
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridEmail">
                        <FloatingLabel label="Email">
                            <Form.Control
                                type="email"
                                placeholder="Email"
                                onChange={handleChange}
                                name="email"
                                value={values.email}
                            />
                        </FloatingLabel>
                    </Form.Group>
                    <Form.Group as={Col} controlId="formGridPassword">
                        <FloatingLabel label="Password">
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                onChange={handleChange}
                                name="password"
                            />
                        </FloatingLabel>
                    </Form.Group>
                </Row>
                <FloatingLabel label="Name" className="mb-3">
                    <Form.Control
                        type="text"
                        placeholder="Name"
                        onChange={handleChange}
                        name="name"
                        value={values.name}
                    />
                </FloatingLabel>

                
                    {values.gender === "Male" ? (
                        <Form.Select
                        aria-label="Default select example"
                        className="mb-3"
                        name="gender"
                        onChange={handleChange}
                        value={values.gender}
                        >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </Form.Select>
                    ) : (
                        <Form.Select
                            aria-label="Default select example"
                            className="mb-3"
                            name="gender"
                        onChange={handleChange}
                        value={values.gender}
                        >
                            <option value="Female">Female</option>
                            <option value="Male">Male</option>
                        </Form.Select>
                    )}
                    {/* <option>-Choose Gender-</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option> */}
                
                <FloatingLabel label="Address" className="mb-3">
                    <Form.Control
                        type="text"
                        placeholder="Address"
                        onChange={handleChange}
                        name="address"
                        value={values.address}
                    />
                </FloatingLabel>
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formFile">
                        <Form.Label>Image</Form.Label>
                        <Form.Control
                            type="file"
                            name="image"
                            onChange={convertToBase64}
                        />
                        {image == "" || image == null ? (
                            ""
                        ) : (
                            <img src={`data:image/jpeg;base64,${image}`} width={100} height={100} />
                        )}
                    </Form.Group>
                    <Form.Group as={Col}>
                        <Form.Label>Date of birth</Form.Label>
                        <br />
                        <Form.Control type="date" name="dob" value={values.dob.split('T')[0]} onChange={handleChange}/>
                    </Form.Group>
                </Row>

                <Button variant="info" type="submit" className="appButton mt-5" onClick={handleUpdate}>
                    Update
                </Button>
                <Button variant="danger" className="appButton ms-5 mt-5" onClick={handleDelete}>
                    Delete
                </Button>
            </Form>
        </div>
    );
};

export default MManagerDetail;
