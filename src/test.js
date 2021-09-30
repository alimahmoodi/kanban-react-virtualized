import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { AutoSizer, List } from "react-virtualized";
import React from "react";

<DragDropContext onDragEnd={onDragEnd}>
  <Droppable droppableId="list">
    {(provided) => (
      <div
        style={{ width: "100%", height: "100%" }}
        ref={provided.innerRef}
        {...provided.droppableProps}
      >
        {people.map((item, index) => {
          return (
            <Draggable key={item.id} draggableId={item.id} index={index}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  // onClick={() => handleHover(index)}
                  // onMouseLeave={() => handleHover(index)}
                  className={"wrapper"}
                  style={{
                    border: "1px solid rgba(0,0,0,.2)",
                    // padding: 10,
                    // ...style,
                  }}
                >
                  <h2>{item.name}</h2>
                  <p>{item.bio}</p>
                  <div
                    style={{
                      display:
                        clickRow && clickRow === index ? "block" : "none",
                      backgroundColor: "blue",
                    }}
                  >
                    test
                  </div>
                </div>
              )}
            </Draggable>
          );
        })}
        <AutoSizer>
          {({ width, height }) => (
            <List
              ref={listRef}
              width={width}
              height={height}
              rowHeight={cache.current.rowHeight}
              deferredMeasurementCache={cache.current}
              rowCount={people.length}
              rowRenderer={rowRender}
            />
          )}
        </AutoSizer>
        {provided.placeholder}
      </div>
    )}
  </Droppable>
</DragDropContext>;
