import { useReducer, createContext, useContext, useId, useEffect } from "react";

const MessageContext = createContext();

const MESSAGE_ACTIONS = {
  ADD_MESSAGE: "ADD_MESSAGE",
  REMOVE_MESSAGE: "REMOVE_MESSAGE",
};

const MESSAGE_TYPES = {
  ERROR: "ERROR",
  SUCCESS: "SUCCESS",
  INFO: "INFO",
};

const messageReducer = (state, action) => {
  switch (action.type) {
    case MESSAGE_ACTIONS.ADD_MESSAGE:
      return { ...state, messages: [action.payload, ...state.messages] };
    case MESSAGE_ACTIONS.REMOVE_MESSAGE:
      const updatedMessages = state.messages.filter((message) => {
        return message.id !== action.payload;
      });
      return { ...state, messages: updatedMessages };
    default:
      return state;
  }
};

const MessageProvider = ({ children }) => {
  const [state, dispatch] = useReducer(messageReducer, { messages: [] });

  const removeMessage = (messageId) => {
    dispatch({
      type: MESSAGE_ACTIONS.REMOVE_MESSAGE,
      payload: messageId,
    });
  };

  const createMessage = (text, type, timeout = 5000) => {
    dispatch({
      type: MESSAGE_ACTIONS.ADD_MESSAGE,
      payload: {
        text: text,
        type: type,
        id: window.crypto.randomUUID(),
        timeout: timeout,
      },
    });
  };
  return (
    <MessageContext.Provider
      value={{
        state,
        dispatch,
        MESSAGE_ACTIONS,
        MESSAGE_TYPES,
        createMessage,
        removeMessage,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export const useMessageContext = () => {
  return useContext(MessageContext);
};

export default MessageProvider;
