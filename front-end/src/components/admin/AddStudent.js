import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/Row";
import FloatingLabel from "react-bootstrap/esm/FloatingLabel";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { apiUrl } from "../../contexts/constants";
import { useNavigate } from "react-router-dom";

const AddStudent = () => {
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

    const [faculty, setFaculty] = useState([]);

    useEffect(() => {
        const fetchFaculty = async () => {
            try {
                const res = await axios.get(`${apiUrl}/faculty/`);
                // console.log(res.data);
                setFaculty(res.data.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchFaculty();
    }, []);

    const handleChange = (e) => {
        setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    function convertToBase64(e) {
        console.log(e)
        const reader = new FileReader()
        reader.readAsDataURL(e.target.files[0])
        console.log(reader)
        reader.onload = () => {
            console.log(reader.result)
            const base64result = reader.result.split(',')[1]
            setImage(base64result)
            values.image = base64result
        }
        reader.onerror = error => {
            console.log(error)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios
                .post(`${apiUrl}/student/add`, values)
                .then((res) => console.log(res));
            navigate("/student");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="container add">
            <h1>Add Student</h1>

            <Form>
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridEmail">
                        <FloatingLabel label="Email">
                            <Form.Control
                                type="email"
                                placeholder="Email"
                                onChange={handleChange}
                                name="email"
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
                    />
                </FloatingLabel>

                <Form.Select
                    aria-label="Default select example"
                    className="mb-3"
                    name="gender"
                    onChange={handleChange}
                >
                    <option>-Choose Gender-</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </Form.Select>
                <FloatingLabel label="Address" className="mb-3">
                    <Form.Control
                        type="text"
                        placeholder="Address"
                        onChange={handleChange}
                        name="address"
                    />
                </FloatingLabel>
                <Form.Select
                    aria-label="Default select example"
                    className="mb-3"
                    onChange={handleChange}
                    name="faculty"
                >
                    <option>-Choose Faculty-</option>
                    {faculty.map((faculty) => {
                        return (
                            <option value={faculty._id} key={faculty._id}>
                                {faculty.name}
                            </option>
                        );
                    })}
                </Form.Select>
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formFile">
                        <Form.Label>Image</Form.Label>
                        <Form.Control
                            type="file"
                            name="image"
                            onChange={convertToBase64}
                        />
                        {image == "" || image == null ? "" : <img src={`data:image/jpeg;base64,${image}`} width={100} height={100}/>}
                    </Form.Group>
                    <Form.Group as={Col}>
                        <Form.Label>Date of birth</Form.Label>
                        <br />
                        <Form.Control type="date" name="dob" onChange={handleChange} />
                    </Form.Group>
                </Row>

                <Button
                    variant="info"
                    type="submit"
                    className="appButton"
                    onClick={handleSubmit}
                >
                    Add
                </Button>
            </Form>
        </div>
    );
};

export default AddStudent;
