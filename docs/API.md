# API Endpoints

- [API Endpoints](#api-endpoints)
  - [Authorization / Authentication](#authorization--authentication)
    - [POST Log In](#post-log-in)
    - [DELETE Log Out](#delete-log-out)
  - [Authors](#authors)
    - [POST Create Author (user)](#post-create-author-user)
    - [GET Authors](#get-authors)
    - [GET Specific Author](#get-specific-author)
  - [Books](#books)
    - [GET All Books](#get-all-books)
    - [GET the details of a book](#get-the-details-of-a-book)
    - [PUT edit the properties of a specific book](#put-edit-the-properties-of-a-specific-book)
    - [DELETE Book](#delete-book)
    - [GET Books by Genre](#get-books-by-genre)
    - [GET Books by Author](#get-books-by-author)
    - [GET Books by Keyword](#get-books-by-keyword)
    - [GET Books by Date](#get-books-by-date)
    - [GET Books by Trending](#get-books-by-trending)
  - [Chapters](#chapters)
    - [POST a chapter of a book](#post-a-chapter-of-a-book)
    - [GET all chapters of a book](#get-all-chapters-of-a-book)
    - [GET a chapter of a book](#get-a-chapter-of-a-book)
  - [Genres](#genres)
    - [Get](#get)
  - [Read History](#read-history)
    - [GET Author Read History](#get-author-read-history)
    - [POST Create Read History Item](#post-create-read-history-item)
    - [DELETE Author Read History Item](#delete-author-read-history-item)
  - [Follows](#follows)
    - [GET Follow List](#get-follow-list)
    - [POST Create Follow](#post-create-follow)
    - [DELETE Follow](#delete-follow)
  - [DBML](#dbml)

## Authorization / Authentication

### POST Log In

```http
POST /token HTTP/1.1
Content-type: application/x-www-form-urlencoded

  username: william.shakespeare
  password: tobeornottobe123!@
```

- Response: Account information and a token

- Response shape (JSON):

  ```json
  {
    "Author": {
      "id": 1,
      "username": "william.shakespeare",
      "first_name": "William",
      "last_name": "Shakespeare",
      "avatar": "https://www.test.com/avatar1.png"
    },
    "token": string
  }
  ```

### DELETE Log Out

```http
DELETE /token HTTP/1.1
header:
  Authorization: Bearer token
```

- Response: always true

- Response shape (`JSON`):

```json
{
  "deleted": true
}
```

## Authors

### POST Create Author (user)

- Request:

```http
POST /api/authors/ HTTP/1.1

{
  "username": "william.shakespeare",
  "password": "tobeornottobe123!@",
  "confirm_password": "tobeornottobe123!@",
}

```

- Response: Creating an Author would send back a token so they can be logged in after account creation.

- Response Shape (`JSON`):

```jsonc
{
  "token": string
}
```

### GET Authors

```http
GET /api/authors HTTP/1.1
```

- Response: List of all authors

- Response Shape (`JSON`):

  ```jsonc
  "authors": [
    {
      "id": 1,
      "first_name": "William",
      "last_name": "Shakespeare",
      "books": [
        {
          "id": 1,
          "title": "Romeo & Juliet"
        }
      ]
    },
  ]
  ```

### GET Specific Author

```http
GET /api/authors/{author.id} HTTP/1.1
```

- Response: Details of a single author

- Response shape (JSON):

  ```jsonc
  {
    "Author": {
      "id": 1,
      "username": "william.shakespeare",
      "first_name": "William",
      "last_name": "Shakespeare",
      "biography": "The enigmatic playwright and poet, born in 1564, is celebrated for his unparalleled impact on English literature. Hailing from Stratford-upon-Avon, his prolific works, including timeless tragedies, comedies, and sonnets, continue to captivate global audiences, leaving an indelible mark on the world of drama and language.",
      "avatar": "https://www.test.com/avatar1.png"
    }
  }
  ```

## Books

### GET All Books

```http
GET /api/books HTTP/1.1
```

- Response: This will fetch all books in the database.

- Response Shape:

  ```jsonc
  {
    "books": [
      {
        "id": 1,
        "title": "Romeo & Juliet",
        "author_id": 1,
        "summary": "Shakespeare's 'Romeo and Juliet': A timeless tale of forbidden love, feuding families, and destiny's unforgiving hand.",
        "cover": "https://www.test.com/image.png",
        "is_published": true,
        "genre": "Drama"
      },
      {
        "id": 2,
        "title": "Othello",
        "author_id": 1,
        "summary": "A gripping tragedy of manipulation and jealousy, where a celebrated general's marriage becomes a battleground for deceit, leading to a devastating spiral of suspicion and tragedy.",
        "cover": "https://www.test.com/image2.png",
        "is_published": false,
        "genre": "Drama"
      }
    ]
  }
  ```

```http
POST /api/books HTTP/1.1
Headers:
  Authorization: Bearer {token}
```

```jsonc
{
  "title": "Frankenstein; or, The Modern Prometheus",
  "summary": "Mary Shelley's iconic novel",
  "cover": "https://www.test.com/image829.png",
  "genre": "Horror"
}
```

Request Body:

```jsonc
{
  "title": "Frankenstein; or, The Modern Prometheus",
  "summary": "Mary Shelley's iconic novel",
  "cover": "https://www.test.com/image829.png",
  "genre": "Horror"
}
```

Response Shape:

```jsonc
{
  "id": 18,
  "author.id": 32,
  "title": "Frankenstein; or, The Modern Prometheus",
  "summary": "Mary Shelley's iconic novel explores the boundaries of scientific curiosity and human ambition, as Dr. Victor Frankenstein's creation of life leads to profound ethical questions and tragic consequences, in a haunting tale of creation and its aftermath.",
  "is_published": false,
  "genre": "Horror"
}
```

### GET the details of a book

```http
GET /api/books/{book.id} HTTP/1.1
```

Response Shape: (`JSON`)

```jsonc
{
  "id": 18,
  "author.id": 32,
  "title": "Frankenstein; or, The Modern Prometheus",
  "summary": "Mary Shelley's iconic novel explores the boundaries of scientific curiosity and human ambition, as Dr. Victor Frankenstein's creation of life leads to profound ethical questions and tragic consequences, in a haunting tale of creation and its aftermath.",
  "is_published": false
}
```

### PUT edit the properties of a specific book

```http
PUT /api/books/{book.id} HTTP/1.1
Headers:
  Authorization: Bearer {token}

{
  "title": "Frankenstein",
  "is_published": true
}
```

Response Shape:

```jsonc
{
  "id": 18,
  "author.id": 32,
  "title": "Frankenstein",
  "summary": "Mary Shelley's iconic novel explores the boundaries of scientific curiosity and human ambition, as Dr. Victor Frankenstein's creation of life leads to profound ethical questions and tragic consequences, in a haunting tale of creation and its aftermath.",
  "is_published": true
}
```

### DELETE Book

```HTTP
DELETE /api/books/{book.id} HTTP/1.1
method: DELETE
Headers:
  Authorization: Bearer {token}
```

Response Shape: (`JSON`)

```jsonc
{
  "deleted": true
}
```

- Endpoint path: /api/author/{author.username}/books

`GET /api/author/william.shakespeare/books`

Response Shape:

```json
{
  "books": [
    {
      "id": 1,
      "title": "Romeo & Juliet",
      "author_id": 1,
      "summary": "Shakespeare's 'Romeo and Juliet': A timeless tale of forbidden love, feuding families, and destiny's unforgiving hand.",
      "cover": "https://www.test.com/image.png",
      "is_published": true
    },
    {
      "id": 2,
      "title": "Othello",
      "author_id": 1,
      "summary": "A gripping tragedy of manipulation and jealousy, where a celebrated general's marriage becomes a battleground for deceit, leading to a devastating spiral of suspicion and tragedy.",
      "cover": "https://www.test.com/image2.png",
      "is_published": false
    },
    {
      "id": 7,
      "title": "Julius Caesar",
      "author_id": 1,
      "summary": "Shakespeare's political drama delves into conspiracy and loyalty, as the legendary ruler's assassination sparks a power struggle that tests friendships and principles, unfolding in a riveting clash of ambition and honor.",
      "cover": "https://www.test.com/image8.png",
      "is_published": true
    }
  ]
}
```

### GET Books by Genre

```http
GET /api/genres/{genre.name}/books HTTP/1.1
```

- Response: a list of all books for a given genre.

- Response Shape (`JSON`):

```jsonc
"books":[
    {
      "id": 1,
      "title": "Romeo & Juliet",
      "author_id": 1,
      "summary": "Shakespeare's 'Romeo and Juliet': A timeless tale of forbidden love, feuding families, and destiny's unforgiving hand.",
      "cover": "https://www.test.com/image.png",
      "is_published": true
    },
    {
      "id": 2,
      "title": "Othello",
      "author_id": 1,
      "summary": "A gripping tragedy of manipulation and jealousy, where a celebrated general's marriage becomes a battleground for deceit, leading to a devastating spiral of suspicion and tragedy.",
      "cover": "https://www.test.com/image2.png",
      "is_published": false
    },
    {
      "id": 7,
      "title": "Julius Caesar",
      "author_id": 1,
      "summary": "Shakespeare's political drama delves into conspiracy and loyalty, as the legendary ruler's assassination sparks a power struggle that tests friendships and principles, unfolding in a riveting clash of ambition and honor.",
      "cover": "https://www.test.com/image8.png",
      "is_published": true
    }
]
```

### GET Books by Author

```http
GET /api/{author.id}/books HTTP/1.1
```

- Response: List of all books by a specific author

- Response Shape (`JSON`):

```jsonc
"books":[
    {
      "id": 1,
      "title": "Romeo & Juliet",
      "author_id": 1,
      "summary": "Shakespeare's 'Romeo and Juliet': A timeless tale of forbidden love, feuding families, and destiny's unforgiving hand.",
      "cover": "https://www.test.com/image.png",
      "is_published": true
    },
    {
      "id": 2,
      "title": "Othello",
      "author_id": 1,
      "summary": "A gripping tragedy of manipulation and jealousy, where a celebrated general's marriage becomes a battleground for deceit, leading to a devastating spiral of suspicion and tragedy.",
      "cover": "https://www.test.com/image2.png",
      "is_published": false
    },
    {
      "id": 7,
      "title": "Julius Caesar",
      "author_id": 1,
      "summary": "Shakespeare's political drama delves into conspiracy and loyalty, as the legendary ruler's assassination sparks a power struggle that tests friendships and principles, unfolding in a riveting clash of ambition and honor.",
      "cover": "https://www.test.com/image8.png",
      "is_published": true
    }
]
```

### GET Books by Keyword

```http
GET /api/books?q={search_terms} HTTP/1.1
```

- Response: Get Books by keyword - this can include matches to the genre, the title, the author, or the summary of the book.

- Response Shape (`JSON`):

```jsonc
"books":[
     {
      "id": 1,
      "title": "Romeo & Juliet",
      "author_id": 1,
      "summary": "Shakespeare's 'Romeo and Juliet': A timeless tale of forbidden love, feuding families, and destiny's unforgiving hand.",
      "cover": "https://www.test.com/image.png",
      "is_published": true
    },
    {
      "id": 2,
      "title": "Othello",
      "author_id": 1,
      "summary": "A gripping tragedy of manipulation and jealousy, where a celebrated general's marriage becomes a battleground for deceit, leading to a devastating spiral of suspicion and tragedy.",
      "cover": "https://www.test.com/image2.png",
      "is_published": false
    },
    {
      "id": 7,
      "title": "Julius Caesar",
      "author_id": 1,
      "summary": "Shakespeare's political drama delves into conspiracy and loyalty, as the legendary ruler's assassination sparks a power struggle that tests friendships and principles, unfolding in a riveting clash of ambition and honor.",
      "cover": "https://www.test.com/image8.png",
      "is_published": true
    }
]
```

### GET Books by Date

```http
GET /api/books?limit={integer} HTTP/1.1
```

- Request: Get the most recent books, defined by the `limit` query parameter.

- Request Response (`JSON`):

```jsonc
"books":[
  // this supposes that we set the "limit" to 1.
  {
      "id": 7,
      "title": "Julius Caesar",
      "author_id": 1,
      "summary": "Shakespeare's political drama delves into conspiracy and loyalty, as the legendary ruler's assassination sparks a power struggle that tests friendships and principles, unfolding in a riveting clash of ambition and honor.",
      "cover": "https://www.test.com/image8.png",
      "is_published": true
    }
]
```

### GET Books by Trending

```http
GET /api/books/trending HTTP/1.1
```

- Request: Gets a list of the trending books. Trending may be derived from looking at the "read_history" within a certain timeframe (based on timestamps), and getting the books with entries within that timeframe, sorted by the number of "read_history" entries they get.

- Request Shape (`JSON`):

```jsonc
"books":[
     {
      "id": 1,
      "title": "Romeo & Juliet",
      "author_id": 1,
      "summary": "Shakespeare's 'Romeo and Juliet': A timeless tale of forbidden love, feuding families, and destiny's unforgiving hand.",
      "cover": "https://www.test.com/image.png",
      "is_published": true
    },
    {
      "id": 2,
      "title": "Othello",
      "author_id": 1,
      "summary": "A gripping tragedy of manipulation and jealousy, where a celebrated general's marriage becomes a battleground for deceit, leading to a devastating spiral of suspicion and tragedy.",
      "cover": "https://www.test.com/image2.png",
      "is_published": false
    },
]
```

## Chapters

### POST a chapter of a book

```http
POST /api/books/1/chapters HTTP/1.1
Headers:
  Authorization: Bearer {token}

```

```jsonc
{
  "book_id": 1,
  "title": "SCENE I A public place",
  "content": "
        Enter Sampson and Gregory armed with swords and bucklers.

        SAMPSON.
        Gregory, on my word, we’ll not carry coals.

        GREGORY.
        No, for then we should be colliers.

        SAMPSON.
        I mean, if we be in choler, we’ll draw.

        GREGORY.
        Ay, while you live, draw your neck out o’ the collar.
  ",
}
```

- Response Shape (`JSON`):

```jsonc
"chapter":{
  "id": 1,
  "book_id": 1,
  "title": "SCENE I. A public place.",
  "content": "
        Enter Sampson and Gregory armed with swords and bucklers.

        SAMPSON.
        Gregory, on my word, we’ll not carry coals.

        GREGORY.
        No, for then we should be colliers.

        SAMPSON.
        I mean, if we be in choler, we’ll draw.

        GREGORY.
        Ay, while you live, draw your neck out o’ the collar.
  ",
  "views": 0,
  "is_published": false
}
```

### GET all chapters of a book

```http
GET /api/books/1/chapters/ HTTP/1.1
```

- Response: Get the list of all chapters, their id, and the chapter title for a List view of all chapters of a specific book. ORDER BY chapter.order

- Response Shape (`JSON`):

```jsonc
"chapters":[
  {
    "id": 1,
    "order": 1,
    "title": "SCENE I. A public place."
  },
  {
    "id": 78,
    "order": 2,
    "title": "SCENE II. A Street."
  }
]

```

### GET a chapter of a book

```http
GET /api/books/1/chapters/1 HTTP/1.1
```

- Response: A single chapter's response

Response Shape: (`JSON`)

```jsonc
"chapter":{
  "id": 1,
  "book_id": 1,
  "title": "SCENE I. A public place.",
  "content": "
        Enter Sampson and Gregory armed with swords and bucklers.

        SAMPSON.
        Gregory, on my word, we’ll not carry coals.

        GREGORY.
        No, for then we should be colliers.

        SAMPSON.
        I mean, if we be in choler, we’ll draw.

        GREGORY.
        Ay, while you live, draw your neck out o’ the collar.
  ",
  "views": 100,
  "is_published": true
}

```

## Genres

Genres are a static list, so the actual genres would be initialized on database setup, or using a tool like PGAdmin or DBeaver to insert new rows into the Genres table.

### Get

```http
GET /api/genres/ HTTP/1.1
```

- Response: Get a list of all genres

- Response Shape: (`JSON`)
  ```jsonc
  "genres": [
    {
      "id": 1,
      "name": "Non-Fiction"
    },
    {
      "id": 2,
      "name": "Fiction"
    },
    {
      "id": 3,
      "name": "Fantasy"
    },
    {
      "id": 4,
      "name":"Science Fiction",
    },
    {
      "id": 5,
      "name": "Children's",
    }
  ]
  ```

## Read History

### GET Author Read History

```http
GET /api/authors/{author.id}/history HTTP/1.1
header:
  Authorization: Bearer token
```

- Response: Returns a list of the Author's read history, which is all the chapters they've read.

- Response Shape (`JSON`):

```jsonc
"read_history": [
  {
    "chapter_id": 12,
    "read_at": "Thu, 10 Aug 2023 18:45:46 GMT"
  },
  {
    "chapter_id": 15,
    "read_at": "Thu, 09 Aug 2023 12:45:46 GMT"
  },
]
```

### POST Create Read History Item

This would be automatic as an Author reads a chapter, but it can also be toggled manually (mark as read)

```http
DELETE /api/authors/{author.id}/history HTTP/1.1
header:
  Authorization: Bearer token

{
  "chapter_id": 12
}
```

- Response: history object

- Response Shape (`JSON`):

```jsonc
{
  "created": true
}
```

### DELETE Author Read History Item

Users can delete items on their read history (mark as unread)

```http
DELETE /api/authors/{author.id}/history/{read_history.id} HTTP/1.1
header:
  Authorization: Bearer token
```

- Response: always true
- Response shape (`JSON`):

```json
true
```

## Follows

### GET Follow List

```http
GET /api/authors/1/follows HTTP/1.1
header:
  Authorization: Bearer token
```

- Response: Get a full list of an author's followed authors.

- Response Shape (`JSON`):

  ```jsonc
  "follows":[
    {
      "author_id": 1
    },
    {
      "author_id": 7
    },
    {
      "author_id": 23
    }
  ]
  ```

### POST Create Follow

Author clicks on different Author's "follow" button, which creates a "Follow" entry.

```http
POST /api/authors/{author.id}/follows HTTP/1.1
header:
  Authorization: Bearer token

{
  "author_id": 1
}
```

- Response:

- Response Shape (`JSON`)

```jsonc
{
  //TODO: Is this the appropriate response?
  "created": true
}
```

### DELETE Follow

Author clicks on the "unfollow" button, which deletes the "Follow" entry.

```http
DELETE /api/authors/{author.id}/follows/{author.id} HTTP/1.1
header:
  Authorization: Bearer token
```

- Response: always true

- Response shape (`JSON`):

```json
{
  "deleted": true
}
```

## DBML

Schema definition

```dbml
Project NovelNexus{
  database_type: "PostgreSQL"
    Note: '''An online application for subscribing to and sharing stories'''

  Table authors{
    id integer [primary key]
    username varchar(50) [not null, unique]
    email varchar(255) [unique]
    password varchar(255) [not null, unique]
    created_at timestamp [default: `now()`]
    updated_at timestamp
    biography text
    avatar varchar(255)
    first_name varchar(255)
    last_name varchar(255)
  }

  Table books{
    id integer [primary key]
    title varchar(255) [not null]
    author_id integer [ref: > authors.id]
    summary text
    cover varchar(255)
    is_published boolean
    created_at timestamp [default: `now()`]
    updated_at timestamp
  }

  Table chapters{
    id integer [primary key]
    order integer
    book_id integer [ref: > books.id]
    title varchar(255) [not null]
    content text [not null]
    views integer [default: 0]
    is_published boolean
    created_at timestamp [default: `now()`]
    updated_at timestamp
  }

  Table genres{
    id integer [primary key]
    name varchar(50) [unique, not null]
    book_id integer [ref: > books.id]
  }

  Table read_history {
    id integer [primary key]
    user_id integer [ref: > authors.id]
    chapter_id integer [ref: > chapters.id]
    read_at timestamp [default: `now()`]
  }

  Table follows{
    id integer [primary key]
    subscriber integer [ref: > authors.id]
    author integer [ref: > authors.id]
    created_at timestamp [default: `now()`]

    // indexes can speed up lookups,
    // probably not necessary for
    // this application.
    Indexes {
      (subscriber, author)
    }

  }

}
```
