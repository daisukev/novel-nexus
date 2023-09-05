// based on: https://stackoverflow.com/questions/54917131/how-to-dynamically-adjust-textarea-height-with-react
import { useRef, useLayoutEffect, useState } from "react";
const MIN_TEXTAREA_HEIGHT = 22;

export default function TextArea(props) {
  const textareaRef = useRef(null);

  useLayoutEffect(() => {
    // Reset height - important to shrink on delete
    textareaRef.current.style.height = "inherit";
    // Set height
    textareaRef.current.style.height = `${Math.max(
      textareaRef.current.scrollHeight + 10,
      MIN_TEXTAREA_HEIGHT
    )}px`;
  }, [props.value]);

  return (
    <textarea
      {...props}
      // onChange={onChange}
      ref={textareaRef}
      style={{
        minHeight: MIN_TEXTAREA_HEIGHT,
        resize: "none",
      }}
    />
  );
}
