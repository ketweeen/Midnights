import { db } from "../firebase";
import { uid } from "uid";
import { set, onValue, remove, update } from "firebase/database";
import { useState, useEffect } from "react";
import { ref as sRef } from "firebase/storage";

function AllOne() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [tempUuid, setTempUuid] = useState("");

  const handleTodoChange = (e) => {
    setTodo(e.target.value);
  };

  //read
  useEffect(() => {
    onValue(sRef(db), (snapshot) => {
      setTodos([]);
      const data = snapshot.val();
      if (data !== null) {
        Object.values(data).map((todo) => {
          setTodos((oldArray) => [...oldArray, todo]);
        });
      }
    });
  }, []);

  //write
  const writeToDatabase = () => {
    const uuid = uid();
    set(sRef(db, `/${uuid}`), {
      todo,
      uuid,
    });

    setTodo("");
  };

  //update
  const handleUpdate = (todo) => {
    setIsEdit(true);
    setTempUuid(todo.uuid);
    setTodo(todo.todo);
  };

  const handleSubmitChange = () => {
    update(sRef(db, `/${tempUuid}`), {
      todo,
      uuid: tempUuid,
    });

    setTodo("");
    setIsEdit(false);
  };

  //delete
  const handleDelete = (todo) => {
    remove(sRef(db, `/${todo.uuid}`));
  };

  return (
    <div className="AllOne">
      <input type="text" value={todo} onChange={handleTodoChange} />
      {isEdit ? (
        <>
          <button onClick={handleSubmitChange}>Submit Change</button>
          <button
            onClick={() => {
              setIsEdit(false);
              setTodo("");
            }}
          >
            X
          </button>
        </>
      ) : (
        <button onClick={writeToDatabase}>submit</button>
      )}
      {todos.map((todo) => (
        <>
          <h1>{todo.todo}</h1>
          <button onClick={() => handleUpdate(todo)}>update</button>
          <button onClick={() => handleDelete(todo)}>delete</button>
        </>
      ))}
    </div>
  );
}

export default AllOne;

// npm install firebase
// npm install uid
