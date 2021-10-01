import React from "react";

function getStyle(provided, style) {
  if (!style) {
    return provided.draggableProps.style;
  }

  return {
    ...provided.draggableProps.style,
    ...style,
  };
}

const Item = ({ provided, item, style, index, onHover, cache }) => {
  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      style={getStyle(provided, style)}
    >
      <div
        className={"item"}
        onMouseEnter={onHover}
        onMouseLeave={onHover}
        style={{ border: "1px solid black", margin: 8 }}
      >
        <h2>{item.text}</h2>
        <p className={"hidden"}>{item.test}</p>
        <a href={"https://www.google.com"}>google</a>
      </div>
    </div>
  );
};

export default Item;
