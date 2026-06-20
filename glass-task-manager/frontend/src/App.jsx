import { useState, useEffect } from 'react';

const API_URL = import.meta.env.PROD ? '/api/tasks' : 'http://localhost:5000/api/tasks';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Med');
  const [loading, setLoading] = useState(true);

  // Mount Effect
  useEffect(() => {
    // READ: Fetch Tasks
    const fetchTasks = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        setTasks(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // CREATE: Add Task
  const addTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, priority })
      });
      const newTask = await res.json();
      setTasks([newTask, ...tasks]); // Optimistically add at the top
      setTitle('');
      setDescription('');
      setPriority('Med');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  // UPDATE: Toggle completed status
  const toggleComplete = async (task) => {
    try {
      const res = await fetch(`${API_URL}/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...task, completed: !task.completed })
      });
      const updatedTask = await res.json();
      setTasks(tasks.map(t => (t.id === task.id ? updatedTask : t)));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  // DELETE: Remove a task
  const deleteTask = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      setTasks(tasks.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // Helper for Priority Colors
  const getPriorityColor = (level) => {
    switch (level) {
      case 'High': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'Med': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'Low': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      default: return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#2e1065] to-[#0f172a] text-slate-100 p-4 sm:p-8 relative overflow-hidden font-sans">
      
      {/* Abstract Background Lighting (Mesh Blobs) */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600 rounded-full mix-blend-screen filter blur-[128px] opacity-30 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600 rounded-full mix-blend-screen filter blur-[128px] opacity-30 pointer-events-none"></div>
      <div className="absolute top-[30%] left-[40%] w-[350px] h-[350px] bg-pink-600 rounded-full mix-blend-screen filter blur-[128px] opacity-20 pointer-events-none"></div>

      <div className="max-w-3xl mx-auto relative z-10 w-full flex flex-col gap-8 pt-8 md:pt-12">
        
        {/* Header Section */}
        <div className="text-center space-y-3 drop-shadow-lg">
          <h1 className="text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-indigo-300">
            Ethereal Tasks
          </h1>
          <p className="text-slate-400 text-lg font-light tracking-wide">
            Manage your daily goals with absolute clarity.
          </p>
        </div>

        {/* Input Form Setup */}
        <form onSubmit={addTask} className="bg-slate-900/40 backdrop-blur-md border border-white/10 shadow-2xl shadow-purple-900/20 rounded-3xl p-6 sm:p-8 flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row gap-5">
            <input
              type="text"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 text-white placeholder-slate-400/80 focus:outline-none focus:border-purple-400/50 focus:ring-1 focus:ring-purple-400/50 rounded-2xl px-5 py-3.5 transition-all outline-none font-light"
            />
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-400/50 focus:ring-1 focus:ring-purple-400/50 rounded-2xl px-5 py-3.5 transition-all appearance-none cursor-pointer sm:w-40 font-light [&>option]:bg-slate-900"
            >
              <option value="Low">Low Priority</option>
              <option value="Med">Med Priority</option>
              <option value="High">High Priority</option>
            </select>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-5">
            <input
              type="text"
              placeholder="Add a subtle description (optional)..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 text-white placeholder-slate-400/80 focus:outline-none focus:border-purple-400/50 focus:ring-1 focus:ring-purple-400/50 rounded-2xl px-5 py-3.5 transition-all outline-none font-light"
            />
            <button
              type="submit"
              disabled={!title.trim()}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/10 backdrop-blur-md rounded-2xl px-8 py-3.5 transition-all duration-300 shadow-[0_4px_15px_rgba(255,255,255,0.05)] hover:shadow-[0_4px_25px_rgba(255,255,255,0.15)] font-medium disabled:opacity-50 disabled:cursor-not-allowed sm:w-40 flex items-center justify-center gap-2"
            >
              <span>Summon</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            </button>
          </div>
        </form>

        {/* Dynamic Task List */}
        <div className="flex flex-col gap-4 pb-12">
          {loading ? (
            <div className="text-center py-10 text-slate-400 animate-pulse font-light text-lg">
              Synchronizing with the ether...
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-14 text-slate-400 bg-slate-900/30 backdrop-blur-md border border-white/5 rounded-3xl font-light text-lg shadow-inner">
              Your mind is clear. No tasks remain.
            </div>
          ) : (
            tasks.map(task => (
              <div 
                key={task.id} 
                className={`group flex flex-col sm:flex-row sm:items-center gap-5 bg-slate-900/40 backdrop-blur-md border border-white/10 shadow-lg rounded-3xl p-5 md:px-6 transition-all duration-300 hover:bg-slate-800/60 hover:border-white/20 hover:shadow-purple-900/10 ${task.completed ? 'opacity-60 saturate-50' : 'opacity-100'}`}
              >
                
                {/* Custom Checkbox Toggle */}
                <button 
                  onClick={() => toggleComplete(task)}
                  className={`shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${task.completed ? 'bg-purple-500 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]' : 'border-white/30 hover:border-white/70'}`}
                  aria-label="Toggle Complete"
                >
                  {task.completed && (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  )}
                </button>

                {/* Task Details */}
                <div className="flex-1 flex flex-col min-w-0">
                  <div className="flex items-center gap-3">
                    <h3 className={`text-xl font-medium truncate transition-all duration-300 tracking-wide ${task.completed ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                      {task.title}
                    </h3>
                    <span className={`text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full border shadow-sm ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                  {task.description && (
                    <p className={`text-sm mt-1.5 truncate font-light ${task.completed ? 'text-slate-500 line-through' : 'text-slate-400'}`}>
                      {task.description}
                    </p>
                  )}
                </div>

                {/* Red-tinted Delete Glass Button */}
                <button 
                  onClick={() => deleteTask(task.id)}
                  className="sm:opacity-0 sm:group-hover:opacity-100 shrink-0 bg-red-500/10 hover:bg-red-500/30 text-red-400 border border-red-500/20 backdrop-blur-md rounded-2xl p-3 md:p-3.5 transition-all duration-300 self-end sm:self-auto hover:shadow-[0_0_15px_rgba(239,68,68,0.2)] focus:opacity-100"
                  aria-label="Delete Task"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>

              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
