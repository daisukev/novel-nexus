import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import Nav from "../Nav/Nav";
import styles from "./styles/ReadHistory.module.css";
import useToken from "../../jwt.tsx";
import { useMessageContext } from "../../MessageContext";

const ReadHistory = () => {
  const { token, fetchWithToken } = useToken();
  const [readList, setReadList] = useState([]);
  const { createMessage, MESSAGE_TYPES } = useMessageContext();

  const fetchReadHistory = useCallback(async () => {
    const url = `${process.env.REACT_APP_API_HOST}/api/my/history`;
    try {
      const { read_history } = await fetchWithToken(url);
      setReadList(read_history);
    } catch (e) {
      console.error(e);
    }
  }, [fetchWithToken, setReadList]);

  const deleteHistory = async (chapterId) => {
    if (token) {
      try {
        const url = `${process.env.REACT_APP_API_HOST}/api/chapters/${chapterId}/history`;
        const res = await fetchWithToken(url, "DELETE");
        createMessage("Deleted read history item.", MESSAGE_TYPES.SUCCESS);
        fetchReadHistory();
      } catch (e) {
        createMessage(
          "Could not delete read history item",
          MESSAGE_TYPES.ERROR
        );
        console.error(e);
      }
    }
  };

  useEffect(() => {
    if (token) {
      fetchReadHistory();
    }
  }, [token]);

  return (
    <div>
      <Nav />
      <div className={styles.readHistory}>
        <h2>Read History</h2>
        <table className={styles.readHistoryTable}>
          <thead>
            <tr>
              <th>Cover</th>
              <th>Book Title</th>
              <th>Title</th>
              <th>Read On</th>
              <th>View </th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {readList.map((item) => {
              return (
                <tr key={item.book_title + item.chapter_id}>
                  <td>
                    <img
                      src={item.book_cover}
                      height="50px"
                      alt={item.book_title}
                    />
                  </td>
                  <td>
                    <Link to={`/books/${item.book_id}`}>{item.book_title}</Link>
                  </td>

                  <td>
                    <Link
                      to={`/books/${item.book_id}/chapters/${item.chapter_id}`}
                    >
                      {item.chapter_title}
                    </Link>
                  </td>
                  <td>{new Date(item.read_at).toLocaleDateString()}</td>
                  <td>
                    <Link
                      to={`/books/${item.book_id}/chapters/${item.chapter_id}`}
                    >
                      <button className={styles.readButton}>Read Now</button>
                    </Link>
                  </td>
                  <td>
                    <button
                      className={styles.deleteButton}
                      onClick={() => {
                        deleteHistory(item.chapter_id);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReadHistory;
