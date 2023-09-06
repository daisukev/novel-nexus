import { useEffect, useRef, useState, useContext } from "react";
import useToken from "../jwt.tsx";
import { useParams } from "react-router-dom";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
// https://tiptap.dev/api/extensions/typography
import Typography from "@tiptap/extension-typography";
import { useOutletContext } from "react-router-dom";
import { ChaptersContext } from "./BookDetailWorkspace";
import { useMessageContext } from "../MessageContext";

import "./tiptap.css";

export default function ChapterEditor() {
  const { MESSAGE_TYPES, createMessage } = useMessageContext();
  const containerRef = useRef(null);
  const [containerHeight, setContainerHeight] = useState("20rem");
  const [chapter, setChapter] = useState({});
  const [content, setContent] = useState("");
  const { chapterId } = useParams();
  const { bookId } = useParams();
  const { fetchWithToken, token } = useToken();
  const editor = useEditor({
    extensions: [StarterKit, Typography],
    autofocus: true,
    injectCSS: false,
    content: content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setContent(html);
    },
  });

  const windowResize = () => {
    if (containerRef.current) {
      // TODO: this is too magic numbery; change the 40 to an actual calculated height.
      const offsetHeight = containerRef.current.offsetHeight - 40;
      setContainerHeight(`${offsetHeight}px`);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", windowResize);
    return () => {
      window.removeEventListener("resize", windowResize);
    };
  }, []);

  useEffect(() => {
    windowResize();
  }, [containerRef.current]);

  useEffect(() => {
    if (chapter && editor) {
      let chapterContent = chapter.content;
      if (!chapterContent) {
        chapterContent = "<p>Edit Me!</p>";
      }
      setContent(chapterContent);
      editor.commands.setContent(chapterContent);
    }
  }, [chapter]);

  useEffect(() => {
    if (chapterId && token) fetchChapter(chapterId);
  }, [chapterId, token]);

  const fetchChapter = async (chapterId) => {
    const url = `${process.env.REACT_APP_API_HOST}/api/chapters/${chapterId}`;
    try {
      const chapter = await fetchWithToken(url);
      setChapter(chapter);
    } catch (e) {
      console.error(e);
    }
  };

  const updateChapterContent = async (autosave = false) => {
    const url = `${process.env.REACT_APP_API_HOST}/api/books/${bookId}/chapters/${chapterId}`;
    const headers = {
      "Content-Type": "application/json",
    };
    const options = {
      body: JSON.stringify({ content: content }),
    };

    try {
      const data = await fetchWithToken(url, "PUT", headers, options);

      if (autosave) createMessage("Autosaved Chapter", MESSAGE_TYPES.SUCCESS);
      else createMessage(`Saved "${data.title}"`, MESSAGE_TYPES.SUCCESS);
    } catch (e) {
      createMessage("Could not save chapter.", MESSAGE_TYPES.ERROR);
      console.error(e);
    }
  };
  const updateChapterPublished = async (published) => {
    const url = `${process.env.REACT_APP_API_HOST}/api/books/${bookId}/chapters/${chapterId}`;
    const headers = {
      "Content-Type": "application/json",
    };
    const options = {
      body: JSON.stringify({ is_published: published }),
    };

    try {
      const data = await fetchWithToken(url, "PUT", headers, options);
      createMessage(
        `Updated Publish Status: ${data.is_published ? "True" : "False"} `,
        MESSAGE_TYPES.SUCCESS
      );
      fetchChapter(chapterId);
    } catch (e) {
      createMessage(
        "Could not update chapter published status.",
        MESSAGE_TYPES.ERROR
      );
      console.error(e);
    }
  };

  //TODO: currently if a token expires before an author saves, it just... won't save.
  // Fix that

  if (content) {
    return (
      <div
        style={{
          display: "grid",
          marginInline: "1rem",
          marginBottom: "1rem",
          flex: "1",
          overflow: "hidden",
          gridTemplateRows: "auto 1fr",
        }}
      >
        <div>
          {chapter?.is_published ? (
            <button
              type="button"
              onClick={() => {
                updateChapterPublished(false);
              }}
            >
              Unpublish
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                updateChapterPublished(true);
              }}
            >
              Publish
            </button>
          )}
          <p>published? {chapter?.is_published ? "yes" : "no"}</p>
          <ChapterTitle chapter={chapter} />
        </div>
        <div className="editor-container" ref={containerRef}>
          <MenuBar
            editor={editor}
            updateChapterContent={updateChapterContent}
          />
          <EditorContent
            editor={editor && editor}
            style={{ maxHeight: containerHeight }}
          />
        </div>
      </div>
    );
  } else {
    return <div>Loading...</div>;
  }
}

function MenuBar({ editor, containerRef, updateChapterContent }) {
  //remixicon.com/
  return (
    <div className="editor-menu-bar">
      <button
        type="button"
        className={editor.isActive("bold") ? "is-active" : undefined}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <i className="ri-bold" />
      </button>
      <button
        type="button"
        className={editor.isActive("italic") ? "is-active" : undefined}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <i className="ri-italic" />
      </button>
      <button
        type="button"
        className={editor.isActive("strike") ? "is-active" : undefined}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <i className="ri-strikethrough" />
      </button>
      <button
        type="button"
        className={editor.isActive("bulletList") ? "is-active" : undefined}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <i className="ri-list-check" />
      </button>
      <button
        type="button"
        className={editor.isActive("orderedList") ? "is-active" : undefined}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <i className="ri-list-ordered" />
      </button>
      <button
        type="button"
        className={
          editor.isActive("heading", { level: 1 }) ? "is-active" : undefined
        }
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        <i className="ri-h-1" />
      </button>
      <button
        type="button"
        className={
          editor.isActive("heading", { level: 2 }) ? "is-active" : undefined
        }
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <i className="ri-h-2" />
      </button>
      <button
        type="button"
        className={
          editor.isActive("heading", { level: 3 }) ? "is-active" : undefined
        }
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <i className="ri-h-3" />
      </button>
      <button
        type="button"
        className={
          editor.isActive("heading", { level: 4 }) ? "is-active" : undefined
        }
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
      >
        <i className="ri-h-4" />
      </button>
      <button
        type="button"
        className={
          editor.isActive("heading", { level: 5 }) ? "is-active" : undefined
        }
        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
      >
        <i className="ri-h-5" />
      </button>
      <button
        type="button"
        className={
          editor.isActive("heading", { level: 6 }) ? "is-active" : undefined
        }
        onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
      >
        <i className="ri-h-6" />
      </button>
      <button type="button" onClick={() => updateChapterContent()}>
        <i className="ri-save-3-line" />
      </button>
    </div>
  );
}
function ChapterTitle({ chapter }) {
  const { createMessage, MESSAGE_TYPES } = useMessageContext();
  const { fetchChapters } = useContext(ChaptersContext);
  const { bookId, chapterId } = useParams();
  const { token, fetchWithToken } = useToken();
  const [isEditing, setIsEditing] = useState(false);
  const [chapterTitle, setChapterTitle] = useState(chapter.title);
  const fontSize = 25;

  useEffect(() => {
    setChapterTitle(chapter.title);
  }, [chapter.title]);

  const updateChapterTitle = async () => {
    try {
      //
      const url = `${process.env.REACT_APP_API_HOST}/api/books/${bookId}/chapters/${chapterId}`;
      const headers = {
        "Content-Type": "application/json",
      };
      const options = {
        body: JSON.stringify({ title: chapterTitle }),
      };
      const res = await fetchWithToken(url, "PUT", headers, options);
      fetchChapters();
      createMessage(
        `Changed chapter title to: ${chapterTitle}`,
        MESSAGE_TYPES.SUCCESS
      );
    } catch (e) {
      console.error(e);
      setChapterTitle(chapter.title);
      createMessage("Could not change title name.", MESSAGE_TYPES.ERROR);
    }
  };
  const handleEditChapterTitleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // don't input enter
      setIsEditing(false);
      updateChapterTitle();
    }
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setChapterTitle(title);
  };

  return (
    <>
      {isEditing ? (
        <>
          <input
            type="text"
            onChange={handleTitleChange}
            style={{
              padding: "5px",
              fontSize: `${fontSize}px`,
              width: "50%",
              resize: "none",
              boxSizing: "border-box",
            }}
            onKeyUp={handleEditChapterTitleKeyPress}
            value={chapterTitle}
          />
          <button
            type="button"
            onClick={() => {
              updateChapterTitle();
              setIsEditing(false);
            }}
          >
            Save
          </button>
        </>
      ) : (
        <>
          <h3
            style={{
              display: "inline",
              fontSize: fontSize,
              paddingInline: "0.25rem",
            }}
          >
            {chapterTitle}
          </h3>
          <button
            type="button"
            onClick={() => {
              setIsEditing(true);
            }}
          >
            Edit
          </button>
        </>
      )}
    </>
  );
}
