import React, { useEffect, useState } from "react";

export default function Todo() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");
  const [editId, setEditId] = useState(-1);
  const [message, setMessage] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const apiUrl = "http://localhost:8000";

  useEffect(() => {
    getItems();
  }, []);

  const getItems = () => {
    fetch(apiUrl + "/todos")
      .then((res) => res.json())
      .then((res) => setTodos(res));
  };

  const handleSubmit = () => {
    setError("");
    if (title.trim() !== "" && description.trim() !== "") {
      fetch(apiUrl + "/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      })
        .then(async (res) => {
          if (res.ok) {
            setTodos([...todos, { title, description }]);
            setTitle("");
            setDescription("");
            showMessage("Item added successfully");
          } else {
            const errorData = await res.json().catch(() => ({}));
            setError("Unable to create todo item: " + (errorData.error || res.statusText));
          }
        })
        .catch((err) => setError("Network error: " + err.message));
    }
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setEditTitle(item.title);
    setEditDescription(item.description);
  };

  const handleEditCancel = () => {
    setEditId(-1);
    setEditTitle("");
    setEditDescription("");
  };

  const handleUpdate = () => {
    setError("");
    if (editTitle.trim() !== "" && editDescription.trim() !== "") {
      fetch(apiUrl + "/todos/" + editId, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editTitle, description: editDescription }),
      })
        .then(async (res) => {
          if (res.ok) {
            const updatedTodos = todos.map((item) =>
              item._id === editId
                ? { ...item, title: editTitle, description: editDescription }
                : item
            );
            setTodos(updatedTodos);
            handleEditCancel();
            showMessage("Item updated successfully");
          } else {
            const errorData = await res.json().catch(() => ({}));
            setError("Unable to update todo item: " + (errorData.error || res.statusText));
          }
        })
        .catch((err) => setError("Network error: " + err.message));
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this?")) {
      fetch(apiUrl + "/todos/" + id, {
        method: "DELETE",
      }).then(() => {
        const updatedTodos = todos.filter((item) => item._id !== id);
        setTodos(updatedTodos);
      });
    }
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  return (
    <div className="container my-5">
      <div className="bg-dark text-white p-4 rounded shadow-sm mb-4">
       <h1 className="text-left fw-bold fst-italic">📝 To-Do Works</h1>

      </div>

      <div className="card shadow-sm p-4 mb-4">
        <h3>Add New Task</h3>
        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="row g-2 align-items-end">
          <div className="col-md-5">
            <input
              placeholder="Title"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              className="form-control"
              type="text"
            />
          </div>
          <div className="col-md-5">
            <input
              placeholder="Description"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              className="form-control"
              type="text"
            />
          </div>
          <div className="col-md-2">
            <button className="btn btn-primary w-100" onClick={handleSubmit}>
              Add
            </button>
          </div>
        </div>
      </div>

      <div className="card shadow-sm p-4">
        <h3 className="mb-3">Your Tasks</h3>
        {todos.length === 0 ? (
          <p>No tasks yet. Add some!</p>
        ) : (
          <ul className="list-group">
            {todos.map((item) => (
              <li
                key={item._id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div className="w-75">
                  {editId === item._id ? (
                    <div className="row g-2">
                      <div className="col">
                        <input
                          className="form-control"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          placeholder="Edit title"
                        />
                      </div>
                      <div className="col">
                        <input
                          className="form-control"
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          placeholder="Edit description"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <h5 className="mb-1">{item.title}</h5>
                      <p className="mb-0 text-muted">{item.description}</p>
                    </>
                  )}
                </div>
                <div className="btn-group">
                  {editId === item._id ? (
                    <>
                      <button className="btn btn-success" onClick={handleUpdate}>
                        Update
                      </button>
                      <button className="btn btn-warning" onClick={handleEditCancel}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="btn btn-outline-dark" onClick={() => handleEdit(item)}>
                        Edit
                      </button>
                      <button className="btn btn-outline-danger" onClick={() => handleDelete(item._id)}>
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
