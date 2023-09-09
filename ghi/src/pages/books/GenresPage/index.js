import "./index.css";
import Genre from "./Genre";
import { useState, useEffect } from "react";
import { useFetcher } from "react-router-dom";
import Nav from "../../Nav/Nav";

function GenresPage() {
  const [genreData, setGenreData] = useState([]);

  useEffect(() => {
    const url = `${process.env.REACT_APP_API_HOST}/api/genres`;

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error at fetching data");
        }
        return response.json();
      })
      .then((data) => {
        setGenreData(data);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }, []);

  const genres = [];

  if (genreData.genres) {
    for (let i = 0; i < genreData.genres.length; ++i) {
      genres.push(genreData.genres[i].name);
    }
  }

  const color = [
    "#CA965C",
    "#BE8ABF",
    "#6D8B74",
    "#7286D3",
    "#FFB9B9",
    "#525E75",
    "#FF8787",
    "#6096B4",
    "#D7C0AE",
    "#DFCCFB",
    "#65647C",
    "#F0DD92",
    "#D57E7E",
    "#99A799",
    "#BA94D1",
    "#D1EAA3",
    "#AEE2FF",
    "#FFDDD2",
    "#EFB08C",
    "#F3C5C5",
    "#A7727D",
    "#FEBE8C",
    "#BBD6B8",
  ];

  return (
    <div>
      <Nav />
      <div className="genres">
        <h1 className="genres-title">Genres</h1>
        <div className="genre-display">
          {genres.map((eachGenre, index) => {
            let eachColor = color[index];
            return <Genre genre={eachGenre} color={eachColor} key={index} />;
          })}
        </div>
      </div>
    </div>
  );
}

export default GenresPage;
