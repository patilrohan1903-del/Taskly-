import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Edit2, Trash2, Plus, Search, CheckCircle2, Circle, AlertCircle, X, Layers } from 'lucide-react';
import * as api from './api';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  
  const [filter, setFilter] = useState('active'); // 'active', 'completed'
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await api.fetchTasks();
      setTasks(data.reverse());
    } catch (err) {
      setError('Failed to load tasks. Verify backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) {
      setError('Task title cannot be empty.');
      return;
    }
    
    setError('');
    try {
      const newTask = await api.createTask({ title: newTaskTitle });
      setTasks([newTask, ...tasks]);
      setNewTaskTitle('');
    } catch (err) {
      setError('Failed to create task.');
    }
  };

  const handleToggleTask = async (id) => {
    try {
      setTasks(tasks.map(t => t.id === id ? { ...t, status: t.status === 'pending' ? 'completed' : 'pending' } : t));
      await api.toggleTaskStatus(id);
    } catch (err) {
      setError('Failed to update task status.');
      loadTasks();
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      setTasks(tasks.filter(t => t.id !== id));
      await api.deleteTask(id);
    } catch (err) {
      setError('Failed to delete task.');
      loadTasks();
    }
  };

  const startEditing = (task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditTitle('');
  };

  const saveEdit = async (id) => {
    if (!editTitle.trim()) {
      setError('Task title cannot be empty.');
      return;
    }
    setError('');
    try {
      setTasks(tasks.map(t => t.id === id ? { ...t, title: editTitle } : t));
      setEditingId(null);
      await api.updateTask(id, { title: editTitle });
    } catch (err) {
      setError('Failed to update task.');
      loadTasks();
    }
  };

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'active' ? t.status === 'pending' : t.status === 'completed';
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8 font-sans text-textMain transition-colors duration-300">
      <div className="max-w-3xl mx-auto space-y-8 relative">
        
        {/* Header */}
        <div className="text-center space-y-3 mb-10 pt-4">
          <motion.div 
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="flex items-center justify-center gap-3"
          >
            <img src="/taskly-icon.svg" alt="Taskly Logo" className="w-[3.5rem] h-[3.5rem] shadow-sm rounded-2xl" />
            <div className="relative inline-block">
              <h1 className="text-[3.5rem] font-extrabold tracking-tighter text-textMain leading-none pb-2 transition-colors duration-300">
                Taskly
              </h1>
              {/* Approximated green dot for the 'y' tail */}
              <div className="absolute bg-success rounded-full w-2.5 h-2.5" style={{ bottom: '0.4rem', right: '0.55rem' }}></div>
            </div>
          </motion.div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-5 items-center justify-between mb-8">
          <div className="relative w-full md:w-1/2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-textMuted" />
            <input 
              type="text" 
              placeholder="Search tasks..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface border border-borderLight rounded-full py-3.5 pl-12 pr-6 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all placeholder:text-textMuted shadow-sm"
            />
          </div>
          
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            {['active', 'completed'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`cursor-pointer whitespace-nowrap capitalize px-6 py-2.5 text-sm font-semibold rounded-full transition-all duration-200 border ${
                  filter === f 
                  ? 'bg-primary text-white border-primary shadow-md transform scale-105' 
                  : 'bg-surface text-textMuted border-borderLight hover:border-textMuted hover:text-textMain'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Add Task Input */}
        <motion.form 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleAddTask} 
          className="mb-10"
        >
          <div className="flex items-center bg-surface p-2.5 rounded-2xl shadow-sm border border-borderLight hover:shadow-md focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary transition-all duration-300">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => {
                setNewTaskTitle(e.target.value);
                if (error) setError('');
              }}
              placeholder="What do you need to do?"
              className="flex-1 bg-transparent px-5 py-3.5 text-textMain placeholder:text-textMuted/70 font-medium focus:outline-none text-base sm:text-lg transition-colors"
            />
            <button
              type="submit"
              disabled={!newTaskTitle.trim()}
              className="bg-primary hover:bg-primaryHover disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center font-semibold shadow-md shadow-primary/30 transform active:scale-95"
            >
              <Plus className="w-5 h-5 mr-1.5" />
              Add Task
            </button>
          </div>
        </motion.form>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="flex items-center gap-3 p-4 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm font-semibold">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Task List */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-10 h-10 border-[3px] border-borderLight border-t-primary rounded-full animate-spin"></div>
            </div>
          ) : filteredTasks.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-24 px-6 bg-surface rounded-[1.5rem] border border-borderLight shadow-sm flex flex-col items-center gap-6"
            >
               <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center text-textMuted border border-borderLight">
                 <Layers className="w-10 h-10" />
               </div>
              <p className="text-lg font-semibold text-textMuted/80 max-w-xs mx-auto">
                No tasks yet. Add your first task!
              </p>
            </motion.div>
          ) : (
            <AnimatePresence mode='popLayout'>
              {filteredTasks.map((task) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className={`group flex flex-col sm:flex-row sm:items-center gap-4 p-5 sm:p-6 rounded-[1rem] transition-all duration-300 shadow-sm hover:shadow-md border
                    ${task.status === 'completed' 
                      ? 'bg-surface border-borderLight/60 opacity-60 hover:opacity-100' 
                      : 'bg-surface border-borderLight hover:border-primary/30'
                    }
                  `}
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <button
                      onClick={() => handleToggleTask(task.id)}
                      className={`flex-shrink-0 outline-none transition-all duration-300 transform active:scale-90 p-1.5 rounded-full ${
                        task.status === 'completed' 
                        ? 'text-success bg-success/10 border border-success/20' 
                        : 'text-textMuted hover:text-primary hover:bg-primary/10 border border-borderLight hover:border-primary/30'
                      }`}
                    >
                      {task.status === 'completed' ? (
                        <CheckCircle2 className="w-7 h-7" />
                      ) : (
                        <Circle className="w-7 h-7" />
                      )}
                    </button>
                    
                    <div className="flex-1 min-w-0 flex flex-col justify-center gap-1.5">
                      {editingId === task.id ? (
                        <div className="flex items-center gap-2 mt-1 sm:mt-0">
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveEdit(task.id);
                              if (e.key === 'Escape') cancelEditing();
                            }}
                            autoFocus
                            className="flex-1 bg-background border border-borderLight rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm font-semibold transition-colors"
                          />
                          <button onClick={() => saveEdit(task.id)} className="p-2.5 text-success hover:bg-success/10 rounded-lg transition-colors ring-1 ring-inset ring-success/20 shadow-sm">
                            <Check className="w-4 h-4" />
                          </button>
                          <button onClick={cancelEditing} className="p-2.5 text-textMuted hover:bg-background rounded-lg transition-colors ring-1 ring-inset ring-borderLight shadow-sm">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span 
                          onDoubleClick={() => startEditing(task)}
                          className={`text-lg transition-all duration-300 ${
                            task.status === 'completed' ? 'text-textMuted font-medium' : 'text-textMain font-bold'
                          }`}
                        >
                          {task.title}
                        </span>
                      )}

                      {/* Status Badges */}
                      {!editingId && (
                        <div className="flex items-center">
                           <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${
                              task.status === 'completed' ? 'bg-success/5 text-success' : 'bg-warning/10 text-warning'
                           }`}>
                             {task.status}
                           </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  {!editingId && (
                     <div className="flex items-center justify-end gap-2 transition-opacity duration-200 mt-3 sm:mt-0 pl-14 sm:pl-0">
                      <button
                        onClick={() => handleToggleTask(task.id)}
                        className={`flex items-center gap-1.5 p-2 px-3 text-sm font-semibold rounded-lg transition-colors ${
                          task.status === 'completed'
                          ? 'text-textMuted hover:bg-background border border-borderLight'
                          : 'text-primary bg-primary/10 hover:bg-primary/20 hover:border-primary/20 border border-transparent'
                        }`}
                        title="Toggle task"
                      >
                        <Check className="w-4 h-4" />
                        <span className="hidden sm:inline">Complete</span>
                      </button>
                      
                      <div className="w-px h-6 bg-borderLight mx-1 hidden sm:block"></div>

                      <button
                        onClick={() => startEditing(task)}
                        className="p-2 text-textMuted hover:text-primary hover:bg-primary/10 rounded-lg transition-colors border border-transparent hover:border-primary/20"
                        title="Edit task"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-2 text-textMuted hover:text-danger hover:bg-danger/10 rounded-lg transition-colors border border-transparent hover:border-danger/20"
                        title="Delete task"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
