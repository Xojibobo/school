import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getTeachers, createTeacher, updateTeacher, deleteTeacher } from "../instance/SchoolInstance";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Form, Row } from "react-bootstrap";
import image from '../assets/teacher.png'

const CategoriesPage = () => {
    const navigate = useNavigate();
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [show, setShow] = useState(false);
    const [validated, setValidated] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [searchTerm, setSearchTerm] = useState(""); // Add this line
    const [newTeacher, setNewTeacher] = useState({
        id: null,
        firstName: '',
        lastName: '',
        phoneNumber: '',
        isMarried: false
    });

    const handleClose = () => {
        resetForm();
        setShow(false);
    };

    const resetForm = () => {
        setNewTeacher({
            id: null,
            firstName: '',
            lastName: '',
            phoneNumber: '',
            isMarried: false
        });
        setValidated(false);
        setIsEdit(false);
    };

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/login');
        } else {
            const loadTeachers = async () => {
                try {
                    const response = await getTeachers();
                    setTeachers(response.data);
                    setLoading(false);
                } catch (error) {
                    setError('Failed to load teachers');
                    setLoading(false);
                    console.log(error);
                }
            };
            loadTeachers();
        }
    }, [navigate]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    const filteredTeachers = teachers.filter(teacher =>
        teacher.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.lastName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSubmit = async (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.preventDefault();
            if (isEdit) {
                try {
                    const response = await updateTeacher(newTeacher.id, newTeacher);
                    setTeachers(teachers.map(teacher => teacher.id === newTeacher.id ? response.data : teacher));
                    resetForm();
                    setShow(false);
                } catch (error) {
                    console.log("Failed to update teacher:", error);
                }
            } else {
                try {
                    const response = await createTeacher(newTeacher);
                    setTeachers([...teachers, response.data]);
                    resetForm();
                    setShow(false);
                } catch (error) {
                    console.log("Failed to create teacher:", error);
                }
            }
        }
        setValidated(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTeacher({ ...newTeacher, [name]: value });
    };

    const handleCheckboxChange = (e) => {
        setNewTeacher({ ...newTeacher, isMarried: e.target.checked });
    };

    const handleEditClick = (teacher) => {
        setNewTeacher(teacher);
        setIsEdit(true);
        setShow(true);
    };

    const handleDeleteClick = async (id) => {
        try {
            await deleteTeacher(id);
            setTeachers(teachers.filter(teacher => teacher.id !== id));
        } catch (error) {
            console.log("Failed to delete teacher:", error);
        }
    };

    return (
        <div className="container mt-3">
            <h1 className="text-center">Teachers</h1>
            <div className="row d-flex justify-content-center my-3">
                <div className="col-12 col-md-6">
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)} // Update searchTerm on input change
                        />
                        <Button variant="primary" onClick={() => { setShow(true); resetForm(); }}>
                            Create teacher
                        </Button>
                        <Modal show={show} onHide={handleClose}>
                            <Modal.Header closeButton>
                                <Modal.Title>{isEdit ? "Edit Teacher" : "Create New Teacher"}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                                    <Row className="mb-3">
                                        <Form.Group md="4" controlId="firstName">
                                            <Form.Label>First name</Form.Label>
                                            <Form.Control
                                                required
                                                type="text"
                                                placeholder="First name"
                                                name="firstName"
                                                value={newTeacher.firstName}
                                                onChange={handleInputChange}
                                            />
                                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                            <Form.Control.Feedback type="invalid">Please provide a first name.</Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group md="4" controlId="lastName">
                                            <Form.Label>Last name</Form.Label>
                                            <Form.Control
                                                required
                                                type="text"
                                                placeholder="Last name"
                                                name="lastName"
                                                value={newTeacher.lastName}
                                                onChange={handleInputChange}
                                            />
                                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                            <Form.Control.Feedback type="invalid">Please provide a last name.</Form.Control.Feedback>
                                        </Form.Group>

                                        <Form.Group md="4" controlId="phoneNumber">
                                            <Form.Label>Phone number</Form.Label>
                                            <Form.Control
                                                required
                                                type="number"
                                                placeholder="Phone number"
                                                name="phoneNumber"
                                                value={newTeacher.phoneNumber}
                                                onChange={handleInputChange}
                                            />
                                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                            <Form.Control.Feedback type="invalid">Please provide a phone number.</Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group className="my-3">
                                            <Form.Check
                                                label="Are you married"
                                                name="isMarried"
                                                checked={newTeacher.isMarried}
                                                onChange={handleCheckboxChange}
                                            />
                                        </Form.Group>
                                    </Row>
                                    <Button type="submit">{isEdit ? "Save Changes" : "Submit form"}</Button>
                                </Form>
                            </Modal.Body>
                        </Modal>
                    </div>
                </div>
            </div>
            <div className="row mt-5">
                {filteredTeachers.map(teacher => (
                    <div key={teacher.id} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-3 h-100">
                        <div className="card">
                            <img src={image} className="card-img-top" alt="..." />
                            <div className="card-body">
                                <h5 className="card-title">{teacher.firstName} {teacher.lastName}</h5>
                                <p className="card-text"><span className="fw-bold">Phone:</span> {teacher.phoneNumber}</p>
                                <div>
                                    <Link to={'/products/' + teacher.id} className="btn btn-primary me-2">Student</Link>
                                    <Button className="btn btn-warning me-2" onClick={() => handleEditClick(teacher)}>Edit</Button>
                                    <Button className="btn btn-danger" onClick={() => handleDeleteClick(teacher.id)}>Delete</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoriesPage;
