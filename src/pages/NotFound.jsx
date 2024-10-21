import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>404 - Sahifa topilmadi</h1>
            <p>Afsuski, siz qidirgan sahifa mavjud emas.</p>
            <Link to="/login">Bosh sahifaga qaytish</Link>
        </div>
    );
}

export default NotFound;
