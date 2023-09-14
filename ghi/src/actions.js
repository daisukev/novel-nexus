const fetchBook = async (bookId) => {
  const url = `${process.env.REACT_APP_API_HOST}/api/books/${bookId}`;
  try {
    const res = await fetch(url);
    const book = await res.json();
    return book;
  } catch (e) {
    console.error(e);
  }
};

const fetchAllBooks = async () => {
  const url = `${process.env.REACT_APP_API_HOST}/api/books`;
  try {
    const res = await fetch(url);
    const book = await res.json();
    return book;
  } catch (e) {
    console.error(e);
  }
};

const fetchSomeBooks = async (limit = 10, offset = 0) => {
  const url = `${process.env.REACT_APP_API_HOST}/api/books?limit=${limit}&offset=${offset}`;
  try {
    const res = await fetch(url);
    const books = await res.json();
    return books;
  } catch (e) {
    console.error(e);
  }
};

const fetchAuthor = async (identifier) => {
  const url = `${process.env.REACT_APP_API_HOST}/api/authors/${identifier}`;
  try {
    const res = await fetch(url);
    const author = await res.json();
    return author;
  } catch (e) {
    console.error(e);
  }
};

const fetchChapters = async (bookId) => {
  if (!bookId) {
    return null;
  }
  const url = `${process.env.REACT_APP_API_HOST}/api/books/${bookId}/chapters`;
  try {
    const response = await fetch(url);

    if (response.ok) {
      const { chapters } = await response.json();
      return chapters;
    }
  } catch (e) {
    console.error(e, "error while fetching chapters");
  }
};

export { fetchBook, fetchAuthor, fetchChapters, fetchAllBooks, fetchSomeBooks };
