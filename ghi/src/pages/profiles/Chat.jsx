import { useContext, useEffect, useState, Fragment, useRef } from "react";
import useToken from "../../jwt.tsx";
import { ProfileAuthorContext } from "./ProfilePage";
import dompurify from "dompurify";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Extension } from "@tiptap/core";
// https://tiptap.dev/api/extensions/typography
import Typography from "@tiptap/extension-typography";
import styles from "./css/Chat.module.css";
import { Link } from "react-router-dom";

const ChatClient = () => {
  const { token } = useToken();
  const { author } = useContext(ProfileAuthorContext);
  const httpUrl = process.env.REACT_APP_API_HOST;
  const wsUrl = httpUrl.replace(/^http:/, "ws:").replace(/^https:/, "wss:");
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [containerHeight, setContainerHeight] = useState(0);
  const chatRef = useRef(null);
  const containerRef = useRef(null);

  const sendButtonRef = useRef(null);
  const DisableEnter = Extension.create({
    addKeyboardShortcuts() {
      return {
        Enter: () => true,
      };
    },
  });

  const editor = useEditor({
    extensions: [StarterKit, Typography, DisableEnter],
    autofocus: true,
    injectCSS: false,
    editorProps: {
      attributes: {
        class: styles.chatEditor,
      },
    },
    content: "",
  });

  const scrollToBottom = () => {
    chatRef.current.scrollTop = chatRef.current.scrollHeight;
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const connectChat = () => {
    if (token && author) {
      const newSocket = new WebSocket(
        `${wsUrl}/chat/${author.username}?token=${token}`
      );

      newSocket.onopen = () => {
        console.log("WebSocket connected");
      };

      newSocket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        // console.log("Received:", message);
        setMessages((prevMessages) => [...prevMessages, message]);
      };

      newSocket.onclose = () => {
        console.log("WebSocket closed");
      };

      newSocket.onerror = (event) => {};
      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  };

  useEffect(() => {
    connectChat();
  }, [token, author, wsUrl]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey && sendButtonRef) {
      sendButtonRef.current.click();
    }
  };
  const sendMsg = () => {
    if (socket) {
      try {
        const message = editor.getHTML();
        if (message && message !== "<p></p>") {
          socket.send(editor.getHTML());
          editor.commands.setContent("");
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  useEffect(() => {
    windowResize();
  }, [containerRef.current]);

  const windowResize = () => {
    if (containerRef.current) {
      const offsetHeight = Math.floor(
        window.innerHeight -
          containerRef.current.getBoundingClientRect().top -
          20
      );
      setContainerHeight(`${offsetHeight}px`);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", windowResize);
    window.addEventListener("keyup", handleKeyPress);
    windowResize();
    return () => {
      window.removeEventListener("resize", windowResize);
      window.removeEventListener("keyup", handleKeyPress);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={styles.container}
      style={{ height: `${containerHeight}` }}
    >
      <div className={styles.chatContainer} ref={chatRef}>
        {messages.map((msg, i) => {
          const key = `${msg.user} - ${i}`;
          const purifiedMsg = dompurify.sanitize(msg.message);
          if (msg.user === "server") {
            return (
              <div
                key={key}
                className={styles.serverMsg}
                dangerouslySetInnerHTML={{ __html: purifiedMsg }}
              ></div>
            );
          } else {
            if (i !== 0 && messages[i - 1].user === msg.user)
              return (
                <div key={key} className={styles.message}>
                  <div dangerouslySetInnerHTML={{ __html: purifiedMsg }}></div>
                </div>
              );
            else {
              return (
                <Fragment key={key}>
                  <span className={styles.userName}>
                    <Link to={`/authors/${msg.user}`} target="_blank">
                      {msg.user}
                    </Link>
                  </span>
                  <div
                    dangerouslySetInnerHTML={{ __html: purifiedMsg }}
                    className={styles.message}
                  ></div>
                </Fragment>
              );
            }
          }
        })}
      </div>
      <div className={styles.editorContainer}>
        <EditorContent editor={editor && editor} />
        <button
          ref={sendButtonRef}
          className={styles.sendButton}
          onClick={sendMsg}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatClient;
