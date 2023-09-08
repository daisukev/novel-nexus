# Data Models

## Authors

| Field       | Type     | Unique | Optional |
| ----------- | -------- | ------ | -------- |
| id          | integer  | yes    | no       |
| username    | varchar  | yes    | no       |
| email       | varchar  | yes    | yes      |
| password    | varchar  | yes    | no       |
| created_at  | timestamp| no     | yes      |
| updated_at  | timestamp| no     | yes      |
| biography   | text     | no     | yes      |
| avatar      | varchar  | no     | yes      |
| first_name  | varchar  | no     | yes      |
| last_name   | varchar  | no     | yes      |

The `Authors` table represents user authors.

## Books

| Field       | Type     | Unique | Optional |
| ----------- | -------- | ------ | -------- |
| id          | integer  | yes    | no       |
| title       | varchar  | no     | no       |
| author_id   | integer  | no     | no       |
| summary     | text     | no     | yes      |
| cover       | varchar  | no     | yes      |
| is_published| boolean  | no     | yes      |
| created_at  | timestamp| no     | yes      |
| updated_at  | timestamp| no     | yes      |

The `Books` table contains information about books authored by authors.

## Chapters

| Field       | Type     | Unique | Optional |
| ----------- | -------- | ------ | -------- |
| id          | integer  | yes    | no       |
| order       | integer  | no     | yes      |
| book_id     | integer  | no     | no       |
| title       | varchar  | no     | no       |
| content     | text     | no     | no       |
| views       | integer  | no     | yes      |
| is_published| boolean  | no     | yes      |
| created_at  | timestamp| no     | yes      |
| updated_at  | timestamp| no     | yes      |

The `Chapters` table represents individual chapters within books.

## Genres

| Field       | Type     | Unique | Optional |
| ----------- | -------- | ------ | -------- |
| id          | integer  | yes    | no       |
| name        | varchar  | yes    | no       |

The `Genres` table lists the different genres available.

## Read History

| Field       | Type     | Unique | Optional |
| ----------- | -------- | ------ | -------- |
| id          | integer  | yes    | no       |
| user_id     | integer  | no     | no       |
| chapter_id  | integer  | no     | no       |
| read_at     | timestamp| no     | yes      |

The `Read History` table tracks the reading history of users.

## Follows

| Field       | Type     | Unique | Optional |
| ----------- | -------- | ------ | -------- |
| id          | integer  | yes    | no       |
| subscriber_id| integer  | no     | no       |
| author_id   | integer  | no     | no       |
| created_at  | timestamp| no     | yes      |

The `Follows` table records followers and authors being followed.

## Genres Books

| Field       | Type     | Unique | Optional |
| ----------- | -------- | ------ | -------- |
| id          | integer  | yes    | no       |
| book_id     | integer  | no     | no       |
| genre_id    | integer  | no     | no       |

The `Genres Books` table establishes the relationship between books and genres.
