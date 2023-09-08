import { useState, useEffect } from 'react';

export function useAuthors() {
  const [authorsList, setAuthors] = useState([]);

  useEffect(() => {
    async function fetchAuthors() {
      const url = `${process.env.REACT_APP_API_HOST}/api/authors`;

      const fetchData = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      };

      try {
        const response = await fetch(url, fetchData);
        if (response.ok) {
          const data = await response.json();
          setAuthors(data.authors);
          console.log(data.authors, 'author info');
        } else {
          console.error('Response not OK:', response.status, response.statusText);
        }
      } catch (e) {
        console.error(e);
      }
    }

    fetchAuthors();
  }, []);

  return authorsList;
}
