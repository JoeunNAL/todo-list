import styled from "styled-components";
import { useState, useEffect, useRef } from "react";

const Main = styled.main`
  flex-grow: 1;

  ul {
    /* background-color: azure; */
    justify-content: center;
    display: flex;
    flex-wrap: wrap;
    gap: 2.7rem;
    list-style: none;
  }
`;

const H2 = styled.h2`
  /* background-color: azure; */
  color: #aed063;
  font-size: 2.5rem;
  text-align: center;
  margin-top: 4.8rem;
  margin-bottom: 3rem;
`;

const GoalContainer = styled.li`
  width: 240px;
  height: 150px;
  border-radius: 2rem;
  background-color: var(--bg-grey);
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ThisMonth = styled.h4`
  font-size: 1.5rem;
  text-align: center;
  transform: translateY(-0.8rem);
`;

const Input = styled.input`
  border: 1px red dotted;
  background-color: transparent;
  width: 90%;
  height: 70%;
  /* margin: 5px 15px; */
  border-radius: 1.3rem;
  word-break: break-all;
  font-size: 1.5rem;
  text-align: center;

  display: flex;
  justify-content: center;
  align-items: center;
`;
const GoalView = styled.div`
  width: 90%;
  height: 70%;
  border-radius: 1.3rem;
  font-size: 1.5rem;
  text-align: center;

  display: flex;
  justify-content: center;
  align-items: center;
  /* word-break: keep-all; */
`;

const GoalInput = ({ goal, setMyGoals }) => {
  const inputEl = useRef(null);
  const [newValue, setNewValue] = useState(goal.monthlyGoal);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (editMode) {
      inputEl.current.focus();
    }
  }, [editMode]);

  const handleChange = (e) => {
    setNewValue(e.target.value);
  };

  const handleSubmit = (e) => {
    fetch(`http://localhost:3001/monthGoals/${goal.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        // "Access-Control-Allow-Origin": "http://localhost:3001",
      },
      body: JSON.stringify({
        monthlyGoal: newValue,
      }),
    })
      .then(() => {
        setEditMode(false);
        window.location.reload();
      })
      .catch((error) => {
        console.error("Month submit error", error);
      });
  };
  return (
    <>
      {editMode ? (
        <>
          <Input value={newValue} ref={inputEl} onChange={handleChange} />
          <button onClick={handleSubmit}>수정</button>
        </>
      ) : (
        <GoalView
          onClick={() => {
            setEditMode(true);
          }}
        >
          {goal.monthlyGoal}
        </GoalView>
      )}
    </>
  );
};

const Month = () => {
  const [myGoals, setMyGoals] = useState([]);
  useEffect(() => {
    fetch("http://localhost:3001/monthGoals")
      .then((res) => res.json())
      .then((data) => {
        setMyGoals(data);
      });
  }, []);

  return (
    <Main>
      <H2>2022 Goals</H2>
      {myGoals !== undefined ? (
        <ul>
          {myGoals.map((goal) => {
            return (
              <GoalContainer key={goal.id}>
                <ThisMonth>{`${goal.month.slice(0, 3)}.`}</ThisMonth>
                <GoalInput goal={goal} setMyGoals={setMyGoals}></GoalInput>
              </GoalContainer>
            );
          })}
        </ul>
      ) : null}
    </Main>
  );
};
export default Month;
