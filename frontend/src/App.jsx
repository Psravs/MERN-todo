
// importing useState , useEffect hooks 
import { useState, useEffect } from "react";
import "./App.css";

function App() {
  // universe 1 - variables, loops..
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  // fettching todo tasks from backend
  const fetchTodos = async () => {
    try {
      const res = await fetch("/todos");
      const data = await res.json();
      setTodos(data);
    } catch (err) { //error handling
      console.error("Error fetching todos:", err);
    }
  };

  //ading new todo task
  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const res = await fetch("/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newTodo }),
      });
      const data = await res.json();
      setTodos([...todos, data]);
      setNewTodo("");
    } catch (err) { //error handling
      console.error("Error adding todo:", err);
    }
  };

  // delete todo task
  const deleteTodo = async (id) => {
    try {
      await fetch(`/todos/${id}`, { method: "DELETE" });
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (err) { //error handling
      console.error("Error deleting todo:", err);
    }
  };

  //  editing todo task
  const startEdit = (id, text) => {
    setEditingId(id);
    setEditingText(text);
  };

  // Save edited todo task 
  const saveEdit = async (id) => {
    try {
      const res = await fetch(`/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: editingText }),
      });
      const data = await res.json();
      setTodos(todos.map((todo) => (todo._id === id ? data : todo)));
      setEditingId(null);
      setEditingText("");
    } catch (err) { //error handling
      console.error("Error updating todo:", err);
    }
  };

  useEffect(() => { 
    fetchTodos(); //fetching todos 
  }, []);

  // universe 2 - conditionals ..
  return (
    <div className="app">
      <h1>Todo App</h1>

{/* todo form */}
      <form onSubmit={addTodo} className="todo-form">
        <input
          type="text"
          placeholder="Enter a todo task"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          className="todo-input"
          id="todo-input"
          name="todo"
        />
        <button type="submit" className="todo-button">
          Add
        </button>
      </form>

      {/* todo tasks list */}

      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo._id} className="todo-item">
            {editingId === todo._id ? (
              <>
                <input
                  type="text"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  className="edit-input"
                />
                <button  className="action-button" onClick={() => saveEdit(todo._id)}>Save</button>
                <button  className="action-button" onClick={() => setEditingId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <span>{todo.text}</span>
                <div className="actions">
                  <button  className="action-button" onClick={() => startEdit(todo._id, todo.text)}>Edit</button>
                  <button  className="action-button" onClick={() => deleteTodo(todo._id)}>Delete</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
