import './index.css'
import { Link } from "react-router-dom";

function GenresTag (props) {
    return (
        <Link
            to={{
                pathname: `/books/genres/${props.genre}`,
                state: { additionalProp: 'someValue' }
            }}>
            <div className={`genre ${props.index !== 0 ? 'with-margin' : ''}`}>{props.genre}</div>
        </Link>
    );
}


export default GenresTag
