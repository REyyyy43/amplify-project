import { useState } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../../amplify/data/resource';

const client = generateClient<Schema>();

interface Task {
  taskName: string;
  assignedTo: string;
  deadline: string;
  priority: 'normal' | 'high' | 'low';
  status: 'pending' | 'completed';
}

const TaskView = () => {
  const [taskData, setTaskData] = useState<Task>({
    taskName: '',
    assignedTo: '',
    deadline: '',
    priority: 'normal',
    status: 'pending'
  });

  // Handle Task Submission
  const handleTaskSubmit = () => {
    if (!taskData.taskName.trim() || !taskData.assignedTo.trim()) {
      alert('Please fill in all fields.');
      return;
    }
    console.log('Task Submitted:', taskData); // Log task data for now
    setTaskData({ taskName: '', assignedTo: '', deadline: '', priority: 'normal', status: 'pending' }); // Reset task form
  };

  // Handle task field change
  const handleTaskFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTaskData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <section className="task-management">
      <h2 className="section-title">Task Management</h2>
      <form onSubmit={(e) => {
        e.preventDefault();
        handleTaskSubmit();
      }}>
        <div className="form-group">
          <label className="label">Task Name</label>
          <input
            type="text"
            name="taskName"
            value={taskData.taskName}
            onChange={handleTaskFieldChange}
            className="input"
            required
          />
        </div>
        <div className="form-group">
          <label className="label">Assigned To</label>
          <input
            type="text"
            name="assignedTo"
            value={taskData.assignedTo}
            onChange={handleTaskFieldChange}
            className="input"
            required
          />
        </div>
        <div className="form-group">
          <label className="label">Deadline</label>
          <input
            type="date"
            name="deadline"
            value={taskData.deadline}
            onChange={handleTaskFieldChange}
            className="input"
          />
        </div>
        <div className="form-group">
          <label className="label">Priority</label>
          <select
            name="priority"
            value={taskData.priority}
            onChange={handleTaskFieldChange}
            className="input"
          >
            <option value="normal">Normal</option>
            <option value="high">High</option>
            <option value="low">Low</option>
          </select>
        </div>
        <div className="form-group">
          <label className="label">Status</label>
          <select
            name="status"
            value={taskData.status}
            onChange={handleTaskFieldChange}
            className="input"
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn-submit">Submit Task</button>
        </div>
      </form>
    </section>
  );
};

export default TaskView; 