import { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('https://reqres.in/api/login', {
                email: login,
                password: password
            });
            toast.success(<div className="alert alert-success">Login muvaffaqiyatli!</div>);
            localStorage.setItem('token', response.data.token);
            setTimeout(() => {
                navigate('/');
            }, 2000);
        } catch (error) {

            toast.error(
                <div className="alert alert-danger">
                    Noto‘g‘ri email yoki parol! Qaytadan urinib ko‘ring.
                </div>
            );
            console.log(error)
        }
    };

    return (
        <Container>
            <Row className="d-flex justify-content-center align-items-center vh-100">
                <Col md={4} className="shadow bg-light p-4 rounded">
                    <h2 className="text-center">Login</h2>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Login</Form.Label>
                            <Form.Control
                                onChange={e => setLogin(e.target.value)}
                                type="text"
                                placeholder="Login kiriting..."
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Label className='mt-4'>Parol</Form.Label>
                            <Form.Control
                                onChange={e => setPassword(e.target.value)}
                                type="password"
                                placeholder="Parol kiriting"
                                required
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit" className="mt-4 w-100">
                            Login
                        </Button>
                    </Form>
                </Col>
            </Row>


            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </Container>
    );
};

export default LoginPage;
