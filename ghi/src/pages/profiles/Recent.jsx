import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./css/Recent.module.css";
import { ProfileAuthorContext } from "./ProfilePage";

const Recent = () => {
  const { author } = useContext(ProfileAuthorContext);
  const [recentChapters, setRecentChapters] = useState([]);
  const limit = 10;
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [areMoreChapters, setAreMoreChapters] = useState(true);

  const fetchRecentlyUpdatedChapters = async (
    authorId,
    limit = 10,
    offset = 0
  ) => {
    try {
      const url = `${process.env.REACT_APP_API_HOST}/api/authors/${authorId}/chapters?limit=${limit}&offset=${offset}`;
      const res = await fetch(url);
      const newChapters = res.json();
      return newChapters;
    } catch (e) {
      throw new Error("Could not load more chapters.");
    }
  };

  const handleClick = async () => {
    if (areMoreChapters) {
      setIsLoading(true);
      const newChapters = await fetchRecentlyUpdatedChapters(
        author.id,
        limit,
        offset
      );
      if (newChapters.length < limit) {
        setAreMoreChapters(false);
      }
      setRecentChapters((chapters) => [...chapters, ...newChapters]);
      setIsLoading(false);
      setOffset((prevOffset) => prevOffset + limit);
    }
  };

  useEffect(() => {
    if (author && areMoreChapters) {
      (async () => {
        try {
          const authorId = author.id;
          if (authorId) {
            const chapters = await fetchRecentlyUpdatedChapters(authorId);
            if (chapters.length < limit) {
              setAreMoreChapters(false);
            }
            setOffset(chapters.length);
            setRecentChapters(chapters);
          }
        } catch (e) {
          console.error(e);
        }
      })();
    }
  }, [author, areMoreChapters]);

  return (
    <div className={styles.recentChapters}>
      {recentChapters.length < 1 ? (
        "No Recent Chapters."
      ) : (
        <div className={styles.recentChaptersCard}>
          <div></div>
          <div>
            <strong>Chapter Title</strong>
          </div>
          <div className={styles.updatedAt}>
            <strong>Updated Date</strong>
          </div>
        </div>
      )}
      {recentChapters.map((chapter) => {
        return (
          <div className={styles.recentChaptersCard} key={chapter.chapter_id}>
            <Link to={`/books/${chapter.book_id}`}>
              <div className={styles.imgContainer}>
                <img src={chapter.cover} alt={chapter.title} />
              </div>
            </Link>
            <Link
              to={`/books/${chapter.book_id}/chapters/${chapter.chapter_id}`}
            >
              {chapter.chapter_title}
            </Link>
            <div className={styles.updatedAt}>
              {new Date(chapter.updated_at).toLocaleDateString()}
            </div>
          </div>
        );
      })}
      {recentChapters.length > 0 && areMoreChapters && (
        <button className={styles.loadMore} onClick={handleClick}>
          {isLoading ? "Loading..." : "Load More"}
        </button>
      )}
    </div>
  );
};

export default Recent;
