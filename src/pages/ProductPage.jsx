import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getStudents, createStudent, deleteStudent, editStudent } from "../instance/StudentsInstance";
import { Button, Form, Modal, Row } from "react-bootstrap";
import image from '../assets/student.png';

const ProductPage = () => {
    const navigate = useNavigate();
    const { id: teacherId } = useParams();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [show, setShow] = useState(false);
    const [validated, setValidated] = useState(false);
    const [searchQuery, setSearchQuery] = useState(""); // New search query state
    const [newStudent, setNewStudent] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        birthdayDate: '',
        isWorking: false,
        id: null
    });

    const resetForm = () => {
        setNewStudent({
            firstName: '',
            lastName: '',
            phoneNumber: '',
            birthdayDate: '',
            isWorking: false,
            id: null
        });
        setValidated(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewStudent({ ...newStudent, [name]: value });
    };

    const handleCheckboxChange = (e) => {
        setNewStudent({ ...newStudent, isWorking: e.target.checked });
    };

    const handleClose = () => {
        setShow(false);
        resetForm();
    };

    const handleShow = () => setShow(true);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;

        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            try {
                if (newStudent.id) {
                    await editStudent(teacherId, newStudent.id, newStudent);
                    setStudents(students.map(student => student.id === newStudent.id ? newStudent : student));
                } else {
                    const response = await createStudent(teacherId, newStudent);
                    setStudents([...students, response.data]);
                }
                resetForm();
                setShow(false);
            } catch (error) {
                console.error("Error:", error);
            }
        }

        setValidated(true);
    };

    const handleEdit = (student) => {
        setNewStudent({
            firstName: student.firstName,
            lastName: student.lastName,
            phoneNumber: student.phoneNumber,
            birthdayDate: student.birthdayDate,
            isWorking: student.isWorking,
            id: student.id
        });
        setValidated(false);
        setShow(true);
    };

    const handleDelete = async (studentId) => {
        try {
            await deleteStudent(teacherId, studentId);
            setStudents(students.filter(student => student.id !== studentId));
        } catch (error) {
            console.error("Error deleting student:", error);
        }
    };

    const filteredStudents = students.filter(
        student =>
            student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.phoneNumber.includes(searchQuery)
    );

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/login');
        } else {
            const loadStudents = async () => {
                if (teacherId) {
                    try {
                        const response = await getStudents(teacherId);
                        setStudents(response.data);
                    } catch (error) {
                        setError('Failed to load students');
                        console.log(error);
                    } finally {
                        setLoading(false);
                    }
                }
            };
            loadStudents();
        }
    }, [navigate, teacherId]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="container mt-3">
            <h1 className="text-center">Students</h1>
            <div className="row d-flex justify-content-center my-3">
                <div className="col-12 col-md-6">
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)} // Update search query
                        />
                        <Button variant="primary" onClick={handleShow}>
                            Add Student
                        </Button>
                    </div>
                </div>
            </div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{newStudent.id ? 'Edit Student' : 'Add New Student'}</Modal.Title>
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
                                    value={newStudent.firstName}
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
                                    value={newStudent.lastName}
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
                                    value={newStudent.phoneNumber}
                                    onChange={handleInputChange}
                                />
                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                <Form.Control.Feedback type="invalid">Please provide a phone number.</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group md="4" controlId="birthdayDate">
                                <Form.Label>Birthday date</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="Birthday date"
                                    name="birthdayDate"
                                    value={newStudent.birthdayDate}
                                    onChange={handleInputChange}
                                />
                                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                <Form.Control.Feedback type="invalid">Please provide a birthday date.</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="my-3">
                                <Form.Check
                                    label="Are you working"
                                    name="isWorking"
                                    checked={newStudent.isWorking}
                                    onChange={handleCheckboxChange}
                                />
                            </Form.Group>
                        </Row>
                        <Button type="submit">{newStudent.id ? 'Update Student' : 'Add Student'}</Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer></Modal.Footer>
            </Modal>
            <div className="row mt-5">
                {filteredStudents.length > 0 ? (
                    filteredStudents.map(student => (
                        <div key={student.id} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-3 h-100">
                            <div className="card">
                                <img src={image} className="card-img-top" alt="Student" />
                                <div className="card-body">
                                    <h5 className="card-title">{student.firstName} {student.lastName}</h5>
                                    <p className="card-text"><span className="fw-bold">Phone:</span> {student.phoneNumber}</p>
                                    <div>
                                        <button className="btn btn-warning me-2" onClick={() => handleEdit(student)}>Edit</button>
                                        <button className="btn btn-danger" onClick={() => handleDelete(student.id)}>Delete</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No students found.</p>
                )}
            </div>
        </div>
    );
};

export default ProductPage;
