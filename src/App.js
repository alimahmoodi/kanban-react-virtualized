import React, { useRef, useState } from "react";
import ReactDOM from "react-dom";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

import {
  List,
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
} from "react-virtualized";
import faker from "faker";

export default function App() {
  const cache = React.useRef(
    new CellMeasurerCache({
      fixedWidth: true,
      defaultHeight: 100,
    })
  );
  const listRef = useRef();

  const [people, setPeople] = React.useState([]);

  React.useEffect(() => {
    setPeople(
      [...Array(3000).keys()].map((key) => {
        return {
          id: `${key}test`,
          name: `${faker.name.firstName()} ${faker.name.lastName()}`,
          bio: faker.lorem.lines(Math.random() * 10),
        };
      })
    );
  }, []);

  const handleHover = (index) => {
    // cache.current.clear(index);
    // listRef.current.forceUpdateGrid();
    // setClickRow(index);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const copyOf = [...people];
    const sourceItem = copyOf.splice(result.source.index, 1);
    copyOf.splice(result.destination.index, 0, sourceItem[0]);
    console.log(copyOf, "copyOf");
    setPeople(copyOf);
  };

  function getStyle(provided, style) {
    if (!style) {
      return provided.draggableProps.style;
    }

    return {
      ...provided.draggableProps.style,
      ...style,
    };
  }

  const rowRender = ({ key, index, style, parent }) => {
    const person = people[index];
    const patchedStyle = {
      ...style,
      // left: style.left + 8,
      // top: style.top + 8,
      // width: `calc(${style.width} - ${8 * 2}px)`,
      // height: style.height - 8,
    };
    return (
      <CellMeasurer
        key={person.id}
        cache={cache.current}
        parent={parent}
        columnIndex={0}
        rowIndex={index}
      >
        {({ registerChild }) => (
          <Draggable draggableId={person.id} index={index}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                style={getStyle(provided, patchedStyle)}
              >
                <div style={{ border: "1px solid black", margin: 8 }}>
                  <h2>{person.name}</h2>
                  {/*<p>{person.bio}</p>*/}
                </div>
              </div>
            )}
          </Draggable>
        )}
      </CellMeasurer>
    );
  };

  return (
    <div>
      <div
        style={{
          // width: "90%",
          height: "80vh",
          border: "1px solid black",
        }}
      >
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable
            renderClone={(provided, snapshot, rubric) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                // style={{ margin: 0 }}
              >
                <div style={{ border: "1px solid black" }}>
                  <h2>{people[rubric.source.index].name}</h2>
                  {/*<p>{people[rubric.source.index].bio}</p>*/}
                </div>
              </div>
            )}
            mode={"virtual"}
            droppableId="list"
          >
            {(provided) => (
              <div
                style={{ width: "100%", height: "100%" }}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <AutoSizer>
                  {({ width, height }) => (
                    <List
                      ref={(ref) => {
                        // react-virtualized has no way to get the list's ref that I can so
                        // So we use the `ReactDOM.findDOMNode(ref)` escape hatch to get the ref
                        if (ref) {
                          // eslint-disable-next-line react/no-find-dom-node
                          const whatHasMyLifeComeTo = ReactDOM.findDOMNode(ref);
                          if (whatHasMyLifeComeTo instanceof HTMLElement) {
                            provided.innerRef(whatHasMyLifeComeTo);
                          }
                        }
                      }}
                      width={width}
                      height={height}
                      rowHeight={cache.current.rowHeight}
                      deferredMeasurementCache={cache.current}
                      rowCount={people.length}
                      rowRenderer={rowRender}
                    />
                  )}
                </AutoSizer>
                {/*{provided.placeholder}*/}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}
