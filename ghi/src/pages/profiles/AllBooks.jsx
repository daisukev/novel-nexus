import { useContext, useEffect, useState } from "react";
import styles from "./css/AllBooks.module.css";
import { Link } from "react-router-dom";
import { ProfileAuthorContext } from "./ProfilePage";
const AllBooks = () => {
  const { author } = useContext(ProfileAuthorContext);
  const [books, setBooks] = useState([]);

  const fetchBooksByAuthor = async (authorId) => {
    const url = `${process.env.REACT_APP_API_HOST}/api/authors/${authorId}/books`;
    const res = await fetch(url);
    const books = await res.json();
    return books;
  };

  useEffect(() => {
    if (author) {
      (async () => {
        const books = await fetchBooksByAuthor(author.id);
        setBooks(books);
      })();
    }
  }, [author]);

  return (
    <div className={styles.container}>
      <div className={styles.bookGrid}>
        {books.map((book) => {
          return (
            <div className={styles.book} key={book.id + book.title}>
              <div className={styles.imgContainer}>
                <Link to={`/books/${book.id}`}>
                  <img src={book.cover} alt="" />
                </Link>
              </div>
              {book.title}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AllBooks;
