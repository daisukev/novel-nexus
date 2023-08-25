import React, {useState, useEffect} from 'react'
import './books.css'
import originalAtomic  from '../../images/atomic-original.png'
import ChapterCover  from '../../images/gray-chapter-img.png'
import {Link, useParams} from 'react-router-dom'

function BookDetail(){
  const [bookInfo, setBookInfo] = useState('')
  const [chapterList, setChapterList] = useState(null);
  const { bookId } = useParams();


    async function getBookDetail(){
      const url = `http://localhost:8000/api/books/${bookId}`
      try{
        const response = await fetch(url)
        if (response.ok){
          const data = await response.json()
          setBookInfo(data)
        }
      }catch(e){
        console.error("error while fetching basic book info", e)
      }
     }

    const bookBasicInfo = {
        coverImage: originalAtomic,
        title: 'Atomic Habit',
        author: 'By James Clear',
        summary: 'Build a system for getting 1% better every day, Break your bad habits and stick to good ones,stick to good ones,  Avoid the common mistakes most people make when changing habits. Overcome a lack of motivation and willpower.Develop a stronger identity and believe in yourself. ',
      };

   async function handleChapterList(bookId){
     const url = `http://localhost:8000/api/books/${bookId}/chapters`

     try{
      const response = await fetch(url)

      if (response.ok){
        const data = await response.json()
        setChapterList(data)
       }
     }catch(e){
       console.error(e, "error while fetching chapters")
     }
    }

    useEffect(()=>{
      getBookDetail()
      handleChapterList(bookId);

    }, [])

  if (chapterList == undefined){
    return null
  }

  return (
    <>
<div className="book-detail-page">
      <div className="book-detail-container">
        <div className="book-brief-info-container">
        <div className="book-basic-info">
          <img src={bookInfo.coverImage || bookBasicInfo.coverImage} alt={`${bookInfo.title || bookBasicInfo.title} cover`} className="book-detail-cover" />

          <div className="book-detail-summary">
          <h1 className="book-detail-preview">{bookInfo.title || bookBasicInfo.title}</h1>
            <p className="book-detail-preview">{bookBasicInfo.author}</p>
            <p className=" detail-summary-paragraph book-detail-preview">{bookBasicInfo.summary}</p>
            <small className="book-detail-preview">ISBN: D29ENSD30K2DJNS</small>
          <p className="book-detail-preview">  ⭐️⭐️⭐️⭐️</p>
            <div className="book-detail-preview">
            <span className="book-preview-icon-wrapper"><i className="fas fa-heart"></i></span>
            <span className="book-preview-icon-wrapper"><i className="fas fa-bookmark"></i></span>
            <span className="book-preview-icon-wrapper"><i className="fas fa-comment"></i></span>
            </div>
            </div>
          </div>
        </div>
        <hr />


      <div className="book-detail-content-section">
        <div className="chapters-list-wrapper">
          <h2>Chapters</h2>
          {chapterList &&  chapterList.chapters.map((chapter) => (

            <div key={chapter.id} className="chapter-list-container">
             <img src={ChapterCover} alt={`${chapter.title} image`} className="chapter-image" />
              <div className="chapter-preview-info">
                <h3 className="chapter-number">Chapter {chapter.chapter_order}</h3>
                <h4 className="chapter-list-title">{chapter.title}</h4>
                <p className="chapter-brief-content">{chapter.content} ...</p>

                <button  className="chapter-continue-reading"> <Link to="/ChapterRead" >Read..</Link></button>
              </div>
            </div>
          ))}

        </div>
      <div className="sidebar">
            <h2>Sidebar</h2>
            <p>We can put in here some content</p>
          </div>
        </div>
      </div>
      </div>
    </>

)
}
export default BookDetail;
