import React, { useState, useEffect } from 'react';
import api from '../api/api';
import TaskDetail from '../components/TaskDetail';

function HomePage() {
    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);

    useEffect(() => {
        api.get('/')
            .then(response => setTasks(response.data))
            .catch(error => console.error('Error fetching tasks:', error));
    }, []);

    const addTask = (e) => {
        e.preventDefault();
        const taskInput = document.getElementById('task').value;

        if (taskInput.trim()) {
            api.post('/', { title: taskInput })
                .then(response => {
                    setTasks([...tasks, response.data]);
                    document.getElementById('task').value = '';
                })
                .catch(error => console.error('Error adding task:', error));
        }
    };

    const deleteTask = (id, e) => {
        e.stopPropagation(); 
        api.delete(`/${id}`)
            .then(() => setTasks(tasks.filter(task => task.id !== id)))
            .catch(error => console.error('Error deleting task:', error));
    };

    const handleCheckboxChange = (taskId, currentStatus, e) => {
        e.stopPropagation();
        api.put(`/${taskId}`, { is_completed: !currentStatus })
            .then(response => {
                setTasks(tasks.map(task =>
                    task.id === taskId ? { ...task, is_completed: !currentStatus } : task
                ));
            })
            .catch(error => console.error('Error updating task:', error));
    };

    const handleTaskClick = (task) => setSelectedTask(task);

    const handleTaskUpdate = (updatedTask) => {
        setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
        setSelectedTask(updatedTask);
    };

    const closeTaskDetail = () => setSelectedTask(null);

    return (
        <div className="container mt-4">
            <h1 className="mb-4 text-center text-primary">To-Do App</h1>
            <form onSubmit={addTask} className="mb-4">
                <div className="input-group">
                    <input
                        type="text"
                        id="task"
                        name="task"
                        placeholder="Enter a task"
                        className="form-control"
                    />
                    <button type="submit" className="btn btn-success">
                        Add Task
                    </button>
                </div>
            </form>
            <div className="row">
                {tasks.map((task) => (
                    <div key={task.id} className="col-md-6 mb-3">
                        <div
                            className={`card shadow-sm ${task.is_completed ? 'border-success' : ''}`}
                            style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                            onClick={() => handleTaskClick(task)}
                            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <div className="card-body d-flex justify-content-between align-items-center">
                                <span className="fw-bold text-primary flex-grow-1">
                                    {task.title}
                                </span>
                                <div className="d-flex align-items-center">
                                    <input
                                        type="checkbox"
                                        className="form-check-input me-2"
                                        checked={task.is_completed}
                                        onChange={(e) => handleCheckboxChange(task.id, task.is_completed, e)}
                                    />
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={(e) => deleteTask(task.id, e)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {selectedTask && (
                <TaskDetail
                    task={selectedTask}
                    onClose={closeTaskDetail}
                    onUpdate={handleTaskUpdate}
                />
            )}
        </div>
    );
}

export default HomePage;
