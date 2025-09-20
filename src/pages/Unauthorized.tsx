import { Link } from 'react-router-dom';

const Unauthorized = () => {
    return (
        <div>
            <h1>Muri Khaa, tui authorized na........</h1>
            <Link to="/">Home</Link>
        </div>
    );
};

export default Unauthorized;