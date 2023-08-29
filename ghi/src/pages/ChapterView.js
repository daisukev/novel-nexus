import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const ChapterView = () => {
  const { chapterId } = useParams();
  const [chapter, setChapter] = useState(null);

  useEffect(() => {
    if (chapterId) {
      fetchChapter();
    }
  }, [chapterId]);

  const fetchChapter = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_HOST}/api/chapters/${chapterId}`
      );
      if (response.ok) {
        const data = await response.json();
        setChapter(data);
        console.log(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (!chapter) {
    return <div>Chapter not found</div>;
  }

  return (
    <div>
      <h1>
        Chapter {chapter.chapter_order}: {chapter.title}{" "}
      </h1>
      <p>{chapter.content}</p>
    </div>
  );
};

export default ChapterView;
