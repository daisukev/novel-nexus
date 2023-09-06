import React, { useState, useEffect } from "react";
// import "./books.css";
import { Link, useParams } from "react-router-dom";
import GenresTag from './GenresTag'
import Nav from "../Nav/Nav";
import styles from "./styles/BookDetail.module.css";
import DetailHero from "./components/DetailHero";
import { fetchBook, fetchAuthor, fetchChapters } from "../../actions";
import ChaptersList from "../../authors/ChaptersList";
import ChapterList from "./components/ChapterList";

function BookDetail() {
  const [book, setBook] = useState({});
  const [author, setAuthor] = useState({});
  const [chapterList, setChapterList] = useState([]);
  const { bookId } = useParams();

  const [genre, setGenre] = useState([])

  const url = `http://localhost:8000/api/books/${bookId}/genres`;

  fetch(url)
      .then(response => {
          if (!response.ok) {
              throw new Error('Error at fetching data')
          }
          return response.json();
      })
      .then(data => {
        if (data)
        {
          setGenre(data)
        }
        else {
          console.log("No Genre")
        }
      })
      .catch(error => {
          console.error('There was a problem with the fetch operation:', error);
      })

  useEffect(() => {
    if (book) {
      (async () => {
        if (book.author_id) {
          const author = await fetchAuthor(book.author_id);
          setAuthor(author);
        }
        const chapters = await fetchChapters(book.id);
        setChapterList(chapters);
      })();
    }
  }, [book]);

  useEffect(() => {
    (async () => {
      const book = await fetchBook(bookId);
      setBook(book);
    })();
  }, []);

  if (!book || !author) {
    return <div>Loading...</div>;
  }

  //example for now
  //later when we added genres in the backend we can delete this and use bookInfo.genre
  const genres = [];

  if (genre.genres)
  {
    for (let i = 0; i < genre.genres.length; ++i)
    {
      genres.push(genre.genres[i].name)
    }
  }

  return (
    <>
      <div className={styles.bookDetail}>
        <Nav />
        <DetailHero book={book} author={author}>
          <ChapterList chapterList={chapterList} book={book} />
          <div className="book-detail-genres">
                  {
                    // later repalce it with
                    // bookInfo.genre.map(...)
                    genres.map((eachGenre, index) => {
                      return (
                        <GenresTag key={index} genre={eachGenre} index={index}/>
                      )
                    })
                  }
                </div>
        </DetailHero>
      </div>
      {/* <div className="book-detail-page"> */}
      {/*   <div className="book-detail-container"> */}
      {/*     <div className="book-brief-info-container"> */}
      {/*       <div className="book-basic-info"> */}
      {/*         <img */}
      {/*           src={bookInfo.coverImage || bookBasicInfo.coverImage} */}
      {/*           alt={`${bookInfo.title || bookBasicInfo.title} cover`} */}
      {/*           className="book-detail-cover" */}
      {/*         /> */}
      {/**/}
      {/*         <div className="book-detail-summary"> */}
      {/*           <h1 className="book-detail-preview"> */}
      {/*             {bookInfo.title || bookBasicInfo.title} */}
      {/*           </h1> */}
      {/*           <p className="book-detail-preview">{bookBasicInfo.author}</p> */}
      {/*           <p className=" detail-summary-paragraph book-detail-preview"> */}
      {/*             {bookBasicInfo.summary} */}
      {/*           </p> */}
      {/*           <small className="book-detail-preview"> */}
      {/*             ISBN: D29ENSD30K2DJNS */}
      {/*           </small> */}
      {/*           <p className="book-detail-preview"> ⭐️⭐️⭐️⭐️</p> */}
      {/*           <div className="book-detail-preview"> */}
      {/*             <span className="book-preview-icon-wrapper"> */}
      {/*               <i className="fas fa-heart"></i> */}
      {/*             </span> */}
      {/*             <span className="book-preview-icon-wrapper"> */}
      {/*               <i className="fas fa-bookmark"></i> */}
      {/*             </span> */}
      {/*             <span className="book-preview-icon-wrapper"> */}
      {/*               <i className="fas fa-comment"></i> */}
      {/*             </span> */}
      {/*           </div> */}
      {/*         </div> */}
      {/*       </div> */}
      {/*     </div> */}
      {/*     <hr /> */}
      {/**/}
      {/*     <div className="book-detail-content-section"> */}
      {/*       <div className="chapters-list-wrapper"> */}
      {/*         <h2>Chapters</h2> */}
      {/*         {chapterList && */}
      {/*           chapterList.chapters.map((chapter) => ( */}
      {/*             <div key={chapter.id} className="chapter-list-container"> */}
      {/*               <img */}
      {/*                 src={ChapterCover} */}
      {/*                 alt={`${chapter.title} image`} */}
      {/*                 className="chapter-image" */}
      {/*               /> */}
      {/*               <div className="chapter-preview-info"> */}
      {/*                 <h3 className="chapter-number"> */}
      {/*                   Chapter {chapter.chapter_order} */}
      {/*                 </h3> */}
      {/*                 <h4 className="chapter-list-title">{chapter.title}</h4> */}
      {/*                 <p className="chapter-brief-content"> */}
      {/*                   {chapter.content} ... */}
      {/*                 </p> */}
      {/**/}
      {/*                 <button className="chapter-continue-reading"> */}
      {/*                   {" "} */}
      {/*                   <Link to="/ChapterRead">Read..</Link> */}
      {/*                 </button> */}
      {/*               </div> */}
      {/*             </div> */}
      {/*           ))} */}
      {/*       </div> */}
      {/*       <div className="sidebar"> */}
      {/*         <h2>Sidebar</h2> */}
      {/*         <p>We can put in here some content</p> */}
      {/*       </div> */}
      {/*     </div> */}
      {/*   </div> */}
      {/* </div> */}
    </>
  );
}
export default BookDetail;
