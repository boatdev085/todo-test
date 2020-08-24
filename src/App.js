import React, { useState } from "react";
import styled from "styled-components";
import { Input, List, Button } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { SET_TYPE, ADD_VALUE, SET_REDO, ADD_MANUAL } from "./store/todo/action";
function App() {
  const { todo } = useSelector((state) => state);
  const { value, filterType, forFilter, redo, undo } = todo;
  const dispatch = useDispatch();
  const [useInput, setInput] = useState("");
  const handleFilterType = (type) => {
    let newSetValueFilter = [];
    if (type === "all") {
      newSetValueFilter = [];
    }
    if (type === "active") {
      newSetValueFilter = value.filter((f) => f.type === "active") || [];
    }
    if (type === "completed") {
      newSetValueFilter = value.filter((f) => f.type === "completed") || [];
    }
    setRedo({ filterType, value, forFilter });
    dispatch({
      type: SET_TYPE,
      payload: {
        filterType: type || "all",
        forFilter: newSetValueFilter || [],
      },
    });
  };
  const handleChangeInput = (e) => {
    setInput(e.target.value);
  };
  const handleAddValue = () => {
    const newValue = [...value, { type: "active", value: useInput }];
    setRedo({ filterType, value, forFilter });
    dispatch({
      type: ADD_VALUE,
      payload: {
        value: newValue || [],
      },
    });
    setInput("");
  };
  const handleAddTypeForValue = (id) => {
    let newValue = [...value].map((item, idx) => {
      let newObj = { ...item };
      if (idx === id) {
        if (item.type === "active") {
          newObj.type = "completed";
        }
        if (item.type === "completed") {
          newObj.type = "active";
        }
      }
      return newObj;
    });
    setRedo({ filterType, value, forFilter });
    dispatch({
      type: ADD_VALUE,
      payload: {
        value: newValue || [],
      },
    });
  };
  const setRedo = (oldObj) => {
    let newRedo = [...redo, oldObj];
    dispatch({
      type: SET_REDO,
      payload: {
        redo: newRedo || [],
      },
    });
  };
  const redoAndUndo = (action) => {
    if (action === "redo") {
      let getLastRedo = (redo && redo[redo.length - 1]) || {};
      let newRedo =
        redo && redo.length <= 1
          ? []
          : redo.filter((_, idx) => idx < redo.length - 1);
      dispatch({
        type: ADD_MANUAL,
        payload: {
          redo: newRedo || [],
          undo: [...undo, { filterType, value, forFilter }],
          ...getLastRedo,
        },
      });
      return;
    }
    if (action === "undo") {
      let getLastUndo = (undo && undo[undo.length - 1]) || {};
      let newUndo =
        undo && undo.length <= 1
          ? []
          : undo.filter((_, idx) => idx < undo.length - 1);
      dispatch({
        type: ADD_MANUAL,
        payload: {
          undo: newUndo || [],
          redo: [...redo, { filterType, value, forFilter }],
          ...getLastUndo,
        },
      });
      return;
    }
  };
  return (
    <Container>
      <div className="wrapper">
        <Title>Todo list</Title>
        <WrapperInput>
          <Input value={useInput} onChange={handleChangeInput} />
          <Button type="primary" onClick={handleAddValue}>
            Add
          </Button>
        </WrapperInput>
        <List
          header={
            <div>
              Type: {filterType}{" "}
              {filterType !== "all" ? forFilter.length : value.length} items
            </div>
          }
          footer={
            <div>
              <Button
                disabled={redo.length === 0}
                onClick={() => redoAndUndo("redo")}
              >
                redo
              </Button>
              <Button
                disabled={undo.length === 0}
                onClick={() => redoAndUndo("undo")}
              >
                undo
              </Button>
              <label style={{ margin: "0 20px" }}>filter:</label>
              <ItemFilter
                active={filterType === "all"}
                onClick={() => handleFilterType("all")}
              >
                All
              </ItemFilter>
              <ItemFilter
                active={filterType === "active"}
                onClick={() => handleFilterType("active")}
              >
                Active
              </ItemFilter>
              <ItemFilter
                active={filterType === "completed"}
                onClick={() => handleFilterType("completed")}
              >
                Completed
              </ItemFilter>
            </div>
          }
          bordered
          dataSource={filterType !== "all" ? forFilter : value}
          renderItem={(item, idx) => (
            <List.Item>
              <ItemForList
                type={item.type}
                onClick={() => handleAddTypeForValue(idx)}
              >
                {item.value}
              </ItemForList>
            </List.Item>
          )}
        />
      </div>
    </Container>
  );
}

export default App;

const Container = styled.div`
  position: relative;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .wrapper {
    max-width: 1048px;
    width: 100%;
    margin: 0 auto;
  }
`;
const Title = styled.h1`
  text-align: center;
`;
const ItemFilter = styled.button`
  position: relative;
  margin-right: 20px;
  background: none;
  border: none;
  cursor: pointer;
  color: #1890ff;

  ${({ active }) => (active ? "text-decoration: underline;" : "")}
`;
const WrapperInput = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin: 20px 100px;
`;
const ItemForList = styled.div`
  position: relative;
  cursor: pointer;
  ${({ type }) =>
    type === "completed" ? "text-decoration: line-through;" : ""}
`;
