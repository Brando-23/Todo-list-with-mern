import React, { useState } from 'react';

export default function Todo() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [todos, setTodos] = useState([]);
    const [error, setError] = useState("");
    const [msg, setMsg] = useState("");
    const apiurl = "http://localhost:8000";

    const handlesubmit = () => {
        setError("");
        if (title.trim() !== ' ' && description.trim() !== ' ') {
            fetch(apiurl + '/todos', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, description })
            }).then((res) => {
                if (res.ok) {
                    setTodos([...todos, { title, description }]);
                    setMsg("Item added successfully");
                    setTimeout(() => {
                        setMsg("");
                    }, 3000)
                }
                else {
                    setError("Unable to create a list data");
                }
            }).catch(() => {
                setError("Unable to create a list data");
            })
        }
    }

    const handleDelete = (id) => {
        fetch(`${apiurl}/todos/${id}`, { method: "DELETE" })
            .then((res) => {
                if (res.ok) {
                    setTodos(todos.filter(todo => todo._id !== id));
                    setMsg("Item deleted successfully");
                    setTimeout(() => {
                        setMsg("");
                    }, 3000)
                } else {
                    setError("Unable to delete item");
                }
            }).catch(() => {
                setError("Unable to delete item");
            })
    }

    const handleEdit = (id) => {
        const todoToEdit = todos.find(todo => todo._id === id);
        setTitle(todoToEdit.title);
        setDescription(todoToEdit.description);
        setTodos(todos.filter(todo => todo._id !== id));
    }

    React.useEffect(() => {
        fetch(apiurl + '/todos')
            .then((res) => res.json())
            .then((data) => setTodos(data))
            .catch(() => setError("Unable to fetch todos"));
    }, []);

    return (
        <>
            <div className="row p-3 bg-info text-dark">
                <h1 className='text-center'>TODO-LIST Project With MERN Stack</h1>
            </div>
            <div className="row">
                <h3>Add item</h3>
                {msg && <p className="text-success">{msg}</p>}
                <div className="form-group d-flex gap-2">
                    <input className="form-control" type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                    <input className="form-control" type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                    <button className="btn btn-success" onClick={handlesubmit}>Submit</button>
                </div>
                {error && <p className='text-danger'>{error}</p>}
            </div>
            <div className='row mt-3'>
                <h3 className='text-dark'>Task to be listed</h3>
                <ul className='list-group'>
                    {todos.map(todo => (
                        <li key={todo._id} className='list-group-item d-flex justify-content-between bg-info align-items-center my-2 mx-2'>
                            <div className='d-flex flex-column'>
                                <span className='fw-bold'>{todo.title}</span>
                                <span>{todo.description}</span>
                            </div>
                            <div className='d-flex gap-2'>
                                <button className='btn btn-dark' onClick={() => handleEdit(todo._id)}>Edit</button>
                                <button className='btn btn-danger' onClick={() => handleDelete(todo._id)}>Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    )
}
