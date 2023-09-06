import './index.css'
import { useParams } from 'react-router-dom';
import { useState } from 'react'
import { Link } from "react-router-dom";

function Genres() {
    const { genre } = useParams()

    const [genreData, setGenreData] = useState([])

    const url = `http://localhost:8000/api/books/genres/${genre}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error at fetching data')
            }
            return response.json();
        })
        .then(data => {
            setGenreData(data)
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        })


    return (
        <div>
            {
                genreData.map((eachBook) => (
                    <div key={eachBook.id} className="book-card-on-listBook">
                        <Link to={`/books/${eachBook.id}`}>
                            <img src={eachBook.cover} alt={eachBook.title} className="bookCoverOnListBook" />
                        </Link>
                        <h3 className="book-title">{eachBook.title}</h3>
                    </div>
                ))
            }
        </div>


    )
}

export default Genres
