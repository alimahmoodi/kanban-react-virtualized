import React, { useRef, useState } from "react";
import ReactDOM from "react-dom";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import Item from "./item";
import faker from "faker";
import {
  List,
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
} from "react-virtualized";

let uniqueId = 0;
function getItems(count) {
  return Array.from({ length: count }, (_v, _k) => {
    const id = uniqueId++;
    return {
      id: `${id}test`,
      text: `item ${id}`,
      test: `${faker.lorem.lines(Math.random() * 10)}`,
    };
  });
}

const columnsFromBackend = {
  "column-0": {
    id: "column-0",
    title: "در کارتابل",
    items: getItems(10),
  },
  "column-1": {
    id: "column-1",
    title: "در دست قدام",
    items: getItems(11),
  },
  "column-2": {
    id: "column-2",
    title: "خاتمه یافته",
    items: getItems(12),
  },
  "column-3": {
    id: "column-3",
    title: "خاتمه یافته2",
    items: getItems(13),
  },
};

export default function App() {
  const [columns, setColumns] = useState(columnsFromBackend);

  let listRef = {};

  const crateCatch = () => {
    return new CellMeasurerCache({
      fixedWidth: true,
      defaultHeight: 100,
    });
  };

  React.useEffect(() => {
    setColumns(columnsFromBackend);
  }, []);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      });
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      });
    }
  };
  const onHover = (index, cache, columnId) => {
    let { [columnId]: hoveredList } = listRef;
    cache.clear(index);
    hoveredList.recomputeRowHeights();
    hoveredList.forceUpdate();
  };

  const rowRender =
    (items, cache, columnId) =>
    ({ key, index, style, parent }) => {
      const item = items[index];
      const patchedStyle = {
        ...style,
        // left: style.left + 8,
        // top: style.top + 8,
        // width: `calc(${style.width} - ${8 * 2}px)`,
        // height: style.height - 8,
      };
      // console.log(cache, "cache");
      return (
        <CellMeasurer
          key={item.id}
          cache={cache}
          parent={parent}
          columnIndex={0}
          rowIndex={index}
        >
          {({ registerChild }) => (
            <Draggable draggableId={item.id} index={index}>
              {(provided) => (
                <Item
                  cashe={cache}
                  onHover={() => onHover(index, cache, columnId)}
                  item={item}
                  provided={provided}
                  style={patchedStyle}
                  index={index}
                />
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
          height: "100vh",
          border: "1px solid black",
        }}
      >
        <DragDropContext onDragEnd={onDragEnd}>
          {Object.entries(columns).map(([columnId, column], index) => {
            const cache = crateCatch();
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
                    <Item
                      index={index}
                      item={column.items[rubric.source.index]}
                      provided={provided}
                      style={{}}
                    />
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
                        {({ width, height }) => {
                          console.log(listRef, "listRef");
                          return (
                            <List
                              ref={(ref) => {
                                // react-virtualized has no way to get the list's ref that I can so
                                // So we use the `ReactDOM.findDOMNode(ref)` escape hatch to get the ref
                                if (ref) {
                                  // eslint-disable-next-line react/no-find-dom-node
                                  listRef = {
                                    ...listRef,
                                    [columnId]: ref,
                                  };
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
                              rowHeight={cache.rowHeight}
                              deferredMeasurementCache={cache}
                              rowCount={column.items.length}
                              rowRenderer={rowRender(
                                column.items,
                                cache,
                                columnId
                              )}
                            />
                          );
                        }}
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
