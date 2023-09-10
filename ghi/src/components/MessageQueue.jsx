import styles from "./styles/MessageQueue.module.css";
import { useMessageContext } from "../MessageContext";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
const MessageQueue = () => {
  const { state, removeMessage, MESSAGE_TYPES } = useMessageContext();
  const [timers, setTimers] = useState({});
  useEffect(() => {
    state.messages.forEach((message) => {
      if (!timers[message.id]) {
        const removeTimer = setTimeout(() => {
          removeMessage(message.id);
          setTimers((prevTimers) => {
            const updatedTimers = { ...prevTimers };
            delete updatedTimers[message.id];
            clearTimeout(timers[message.id]);
            return updatedTimers;
          });
        }, message.timeout);
        timers[message.id] = removeTimer;
      }
    });
  }, [state.messages, timers, removeMessage]);
  return (
    <div className={styles.messageQueue}>
      {state.messages.map((message) => {
        return (
          <Message
            key={message.id}
            message={message}
            removeMessage={removeMessage}
            MESSAGE_TYPES={MESSAGE_TYPES}
          />
        );
      })}
    </div>
  );
};

const Message = ({ message, removeMessage, MESSAGE_TYPES }) => {
  const [shouldFadeOut, setShouldFadeOut] = useState(false);
  useEffect(() => {
    const fadeOut = setTimeout(() => {
      setShouldFadeOut(true);
    }, message.timeout - 500);
    return () => clearTimeout(fadeOut);
  }, [message.timeout]);
  return (
    <div
      className={`${styles.message} 
${message.type === MESSAGE_TYPES.ERROR ? styles.error : ""}
${message.type === MESSAGE_TYPES.SUCCESS ? styles.success : ""}
${shouldFadeOut ? styles.fadeOut : ""}
`}
    >
      <p>{message.text}</p>
      {message.href ? <Link to={message.href}>View.</Link> : ""}
      <button
        className={styles.removeButton}
        onClick={() => {
          removeMessage(message.id);
        }}
      >
        <i className="ri-close-circle-fill" />
      </button>
    </div>
  );
};

export default MessageQueue;
