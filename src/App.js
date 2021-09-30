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

let uniqueId = 0;
function getItems(count) {
  return Array.from({ length: count }, (_v, _k) => {
    const id = uniqueId++;
    return {
      id: `${id}test`,
      text: `item ${id}`,
    };
  });
}

const columnsFromBackend = {
  "column-0": {
    id: "column-0",
    title: "در کارتابل",
    items: getItems(50),
  },
  "column-1": {
    id: "column-1",
    title: "در دست قدام",
    items: getItems(50),
  },
  "column-2": {
    id: "column-2",
    title: "خاتمه یافته",
    items: getItems(50),
  },
  "column-3": {
    id: "column-3",
    title: "خاتمه یافته2",
    items: getItems(50),
  },
};

export default function App() {
  // const cache = React.useRef(
  //   new CellMeasurerCache({
  //     fixedWidth: true,
  //     defaultHeight: 100,
  //   })
  // );

  const [people, setPeople] = React.useState([]);

  const [columns, setColumns] = useState(columnsFromBackend);

  const cache = React.useMemo(
    () =>
      new CellMeasurerCache({
        fixedWidth: true,
        defaultHeight: 200,
      }),
    [columns]
  );

  const crateCatch = () => {
    return new CellMeasurerCache({
      fixedWidth: true,
      defaultHeight: 500,
    });
  };

  React.useEffect(() => {
    setColumns(columnsFromBackend);
  }, []);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const copyOf = [...people];
    const sourceItem = copyOf.splice(result.source.index, 1);
    copyOf.splice(result.destination.index, 0, sourceItem[0]);
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

  const rowRender =
    (items, csh) =>
    ({ key, index, style, parent }) => {
      const item = items[index];
      console.log(item, "item");
      const patchedStyle = {
        ...style,
        // left: style.left + 8,
        // top: style.top + 8,
        // width: `calc(${style.width} - ${8 * 2}px)`,
        // height: style.height - 8,
      };
      return (
        <CellMeasurer
          key={item.id}
          cache={csh}
          parent={parent}
          columnIndex={0}
          rowIndex={index}
        >
          {({ registerChild }) => (
            <Draggable draggableId={item.id} index={index}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  style={getStyle(provided, patchedStyle)}
                >
                  <div style={{ border: "1px solid black", margin: 8 }}>
                    <h2>{item.text}</h2>
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
          display: "flex",
          // width: "90%",
          height: "80vh",
          border: "1px solid black",
        }}
      >
        <DragDropContext onDragEnd={onDragEnd}>
          {Object.entries(columns).map(([columnId, column], index) => {
            const csh = crateCatch();
            console.log(csh);
            return (
              <div
                style={{
                  display: "flex",
                  flex: 1,
                  flexDirection: "column",
                  alignItems: "center",
                  height: "100%",
                }}
                key={columnId}
              >
                <h2>{column.title}</h2>

                <Droppable
                  renderClone={(provided, snapshot, rubric) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      // style={{ margin: 0 }}
                    >
                      <div style={{ border: "1px solid black" }}>
                        <h2>{column.items[rubric.source.index].text}</h2>
                        {/*<p>{people[rubric.source.index].bio}</p>*/}
                      </div>
                    </div>
                  )}
                  mode={"virtual"}
                  droppableId={columnId}
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
                                const whatHasMyLifeComeTo =
                                  ReactDOM.findDOMNode(ref);
                                if (
                                  whatHasMyLifeComeTo instanceof HTMLElement
                                ) {
                                  provided.innerRef(whatHasMyLifeComeTo);
                                }
                              }
                            }}
                            width={width}
                            height={height}
                            rowHeight={csh.rowHeight}
                            deferredMeasurementCache={csh}
                            rowCount={column.items.length}
                            rowRenderer={rowRender(column.items, csh)}
                          />
                        )}
                      </AutoSizer>
                      {/*{provided.placeholder}*/}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </DragDropContext>
      </div>
    </div>
  );
}
