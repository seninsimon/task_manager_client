"use client";

import React, { useState } from 'react';
import { 
  Layout, 
  Users, 
  Settings, 
  Activity, 
  GitPullRequest, 
  CheckSquare, 
  Plus, 
  X,
  Calendar,
  MoreVertical,
  GitBranch
} from 'lucide-react';

// --- Mock Data ---
const PROJECTS = [
  { id: 1, name: 'Alpha Redesign', desc: 'Q3 UI Overhaul' },
  { id: 2, name: 'Backend Migration', desc: 'Node to Go' },
  { id: 3, name: 'Mobile App', desc: 'iOS & Android' },
];

const MEMBERS = [
  { id: 101, name: 'Alex Rivera', role: 'Frontend Lead', avatar: 'AR' },
  { id: 102, name: 'Sarah Chen', role: 'Product Owner', avatar: 'SC' },
  { id: 103, name: 'Mike Ross', role: 'DevOps', avatar: 'MR' },
];

const TASKS = [
  { 
    id: 't1', 
    title: 'Implement Auth Flow', 
    desc: 'Connect Supabase auth with frontend', 
    date: 'Oct 24', 
    status: 'In Progress',
    todos: [
      { id: 1, text: 'Setup Provider', done: true },
      { id: 2, text: 'Create Login UI', done: false }
    ]
  },
  { 
    id: 't2', 
    title: 'Design System Update', 
    desc: 'Refresh color palette in Tailwind config', 
    date: 'Oct 26', 
    status: 'Todo',
    todos: []
  },
  { 
    id: 't3', 
    title: 'Fix Navigation Bug', 
    desc: 'Menu collapses on mobile view unexpectedly', 
    date: 'Oct 20', 
    status: 'Completed',
    todos: [{ id: 1, text: 'Reproduce bug', done: true }]
  },
];

const StatusBadge = ({ status }) => {
  const styles = {
    'Todo': 'bg-gray-100 text-gray-600',
    'In Progress': 'bg-blue-100 text-blue-700',
    'Completed': 'bg-green-100 text-green-700',
  };
  return (
    <span className={`text-xs font-medium px-2 py-1 rounded-full ${styles[status] || styles['Todo']}`}>
      {status}
    </span>
  );
};

export default function Dashboard() {
  const [activeProject, setActiveProject] = useState(PROJECTS[0].id);
  const [activeMember, setActiveMember] = useState(MEMBERS[0].id);
  const [activeTab, setActiveTab] = useState('Board');
  const [selectedTask, setSelectedTask] = useState(null);

  // Drawer State
  const [todoInput, setTodoInput] = useState('');

  // Handle opening the drawer
  const handleTaskClick = (task) => {
    setSelectedTask({ ...task }); // Clone to avoid direct mutation
  };

  // Close drawer
  const closeDrawer = () => setSelectedTask(null);

  return (
    <div className="flex h-screen w-full bg-gray-50 text-slate-800 font-sans overflow-hidden">
      
      {/* --- COLUMN 1: Projects Sidebar --- */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-5 border-b border-gray-100">
          <h1 className="font-bold text-lg flex items-center gap-2 text-indigo-600">
            <Layout className="w-5 h-5" /> NexusBoard
          </h1>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">Projects</div>
          {PROJECTS.map((project) => (
            <div
              key={project.id}
              onClick={() => setActiveProject(project.id)}
              className={`
                p-3 rounded-lg cursor-pointer transition-all duration-200 group
                ${activeProject === project.id 
                  ? 'bg-indigo-50 border-indigo-200 shadow-sm ring-1 ring-indigo-200' 
                  : 'hover:bg-gray-50 hover:shadow-sm border border-transparent'}
              `}
            >
              <h3 className={`font-semibold ${activeProject === project.id ? 'text-indigo-700' : 'text-gray-700'}`}>
                {project.name}
              </h3>
              <p className="text-xs text-gray-500 mt-1 truncate">{project.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* --- COLUMN 2: Members Panel --- */}
      <div className="w-72 bg-gray-50 border-r border-gray-200 flex flex-col">
        <div className="p-5 border-b border-gray-200 bg-gray-50">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2">
            <Users className="w-4 h-4" /> Team Members
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {MEMBERS.map((member) => (
            <div
              key={member.id}
              onClick={() => setActiveMember(member.id)}
              className={`
                flex items-center gap-3 p-4 border-b border-gray-100 cursor-pointer transition-colors
                ${activeMember === member.id ? 'bg-white border-l-4 border-l-indigo-500 shadow-sm' : 'hover:bg-gray-100 border-l-4 border-l-transparent'}
              `}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
                {member.avatar}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{member.name}</p>
                <p className="text-xs text-gray-500">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- COLUMN 3: Member Workspace --- */}
      <div className="flex-1 flex flex-col bg-white relative">
        {/* Workspace Header & Tabs */}
        <div className="px-8 pt-8 pb-0 border-b border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {MEMBERS.find(m => m.id === activeMember)?.name}'s Workspace
            </h2>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors">
              <Plus className="w-4 h-4" /> New Task
            </button>
          </div>
          
          <div className="flex gap-6">
            {['Board', 'Activity', 'Settings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  pb-3 text-sm font-medium border-b-2 transition-colors
                  ${activeTab === tab 
                    ? 'border-indigo-600 text-indigo-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'}
                `}
              >
                {tab === 'Board' && <Layout className="w-4 h-4 inline mr-2" />}
                {tab === 'Activity' && <Activity className="w-4 h-4 inline mr-2" />}
                {tab === 'Settings' && <Settings className="w-4 h-4 inline mr-2" />}
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 bg-gray-50/50 p-8 overflow-y-auto">
          {activeTab === 'Board' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {TASKS.map((task) => (
                <div
                  key={task.id}
                  onClick={() => handleTaskClick(task)}
                  className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <StatusBadge status={task.status} />
                    <button className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                  <h4 className="font-bold text-gray-800 mb-1">{task.title}</h4>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">{task.desc}</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                      <Calendar className="w-3 h-3" />
                      {task.date}
                    </div>
                    {task.todos.length > 0 && (
                       <div className="flex items-center gap-1 text-xs text-gray-400">
                        <CheckSquare className="w-3 h-3" />
                        {task.todos.filter(t => t.done).length}/{task.todos.length}
                       </div>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Add New Placeholder */}
              <button className="border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center p-6 text-gray-400 hover:border-indigo-300 hover:text-indigo-500 hover:bg-indigo-50 transition-all">
                <Plus className="w-8 h-8 mb-2" />
                <span className="font-medium text-sm">Add New Task</span>
              </button>
            </div>
          )}
          {activeTab !== 'Board' && (
            <div className="flex items-center justify-center h-full text-gray-400">
              Content for {activeTab} tab
            </div>
          )}
        </div>
      </div>

      {/* --- RIGHT DRAWER (Task Details) --- */}
      {selectedTask && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
            onClick={closeDrawer}
          />
          
          {/* Drawer Panel */}
          <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col">
            
            {/* Drawer Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-start">
              <div className="flex-1 mr-4">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Title</label>
                <input 
                  type="text" 
                  defaultValue={selectedTask.title}
                  className="text-xl font-bold text-gray-800 w-full bg-transparent border-none focus:ring-0 p-0 hover:bg-gray-50 rounded"
                />
              </div>
              <button 
                onClick={closeDrawer}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Status Select */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select 
                  defaultValue={selectedTask.status}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 bg-gray-50"
                >
                  <option>Todo</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
              </div>

              {/* Git Branch & PR */}
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <GitBranch className="w-4 h-4" /> Branch Name
                </label>
                <input 
                  type="text" 
                  placeholder="feature/task-name-123"
                  className="w-full font-mono text-sm border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 mb-3"
                />
                <button className="w-full flex items-center justify-center gap-2 bg-slate-800 text-white py-2 rounded-md text-sm font-medium hover:bg-slate-900 transition-colors">
                  <GitPullRequest className="w-4 h-4" /> Create PR Request
                </button>
              </div>

              {/* To-Do List Section */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-indigo-500" /> To-Do List
                  </h3>
                  <span className="text-xs text-gray-400">
                    {selectedTask.todos.filter(t => t.done).length}/{selectedTask.todos.length} Done
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  {selectedTask.todos.map((todo, idx) => (
                    <div key={todo.id} className="flex items-start gap-3 group">
                      <input 
                        type="checkbox" 
                        defaultChecked={todo.done}
                        className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-600 group-hover:text-gray-900">{todo.text}</span>
                    </div>
                  ))}
                  {selectedTask.todos.length === 0 && (
                    <p className="text-sm text-gray-400 italic">No subtasks yet.</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Add new todo item..."
                    value={todoInput}
                    onChange={(e) => setTodoInput(e.target.value)}
                    className="flex-1 text-sm border-gray-300 rounded-md focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  <button className="bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded-md">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
               <button onClick={closeDrawer} className="text-sm text-gray-600 hover:text-gray-900 font-medium px-4 py-2">Cancel</button>
               <button className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700 shadow-sm">Save Changes</button>
            </div>

          </div>
        </>
      )}
    </div>
  );
}