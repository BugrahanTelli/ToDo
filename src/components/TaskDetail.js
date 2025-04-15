import React, { useState } from 'react';
import api from '../api/api';

function TaskDetail({ task, onClose, onUpdate }) {
    const [updatedTitle, setUpdatedTitle] = useState(task.title);
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState(null);

    const handleUpdate = async () => {
        setIsUpdating(true);
        try {
            const response = await api.put(`/${task.id}`, { title: updatedTitle });
            onUpdate(response.data);
        } catch (err) {
            setError('Güncelleme sırasında bir hata oluştu');
            console.error(err);
        }
        setIsUpdating(false);
    };

    return (
        <div className="card shadow-sm my-4">
            <div className="card-header bg-primary text-white">
                <h5 className="mb-0">Task Detail</h5>
            </div>
            <div className="card-body">
                <p className="mb-2"><strong>ID:</strong> {task.id}</p>
                <div className="mb-3">
                    <label className="form-label"><strong>Title:</strong></label>
                    <input
                        type="text"
                        className="form-control"
                        value={updatedTitle}
                        onChange={(e) => setUpdatedTitle(e.target.value)}
                    />
                </div>
                <p className="mb-3">
                    <strong>Completed:</strong> {task.is_completed ? 'Yes' : 'No'}
                </p>
                {error && <p className="text-danger">{error}</p>}
                <div className="d-flex">
                    <button
                        className="btn btn-success me-2"
                        onClick={handleUpdate}
                        disabled={isUpdating}
                    >
                        {isUpdating ? 'Updating...' : 'Update Task'}
                    </button>
                    <button className="btn btn-secondary" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TaskDetail;
