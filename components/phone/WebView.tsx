"use client"

import { ArrowLeft, Share, Save, Bug } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

interface WebViewProps {
  onBack: () => void;
  onView?: () => void;
}

export function WebView({ onBack, onView }: WebViewProps) {
  const [todos, setTodos] = useState([
    { text: "Build a mobile app", completed: false },
    { text: "Create a design", completed: true },
    { text: "Implement streaming", completed: false }
  ]);
  const [inputValue, setInputValue] = useState("");

  // Call onView when component mounts
  useEffect(() => {
    if (onView) {
      onView();
    }
  }, [onView]);

  const addTodo = () => {
    if (inputValue.trim()) {
      setTodos([...todos, { text: inputValue, completed: false }]);
      setInputValue("");
    }
  };

  const toggleTodo = (index: number) => {
    const newTodos = [...todos];
    newTodos[index].completed = !newTodos[index].completed;
    setTodos(newTodos);
  };

  return (
    <div className="flex flex-col h-full select-none touch-manipulation">
      {/* Top navigation bar */}
      <div className="flex items-center justify-between p-2 bg-white dark:bg-black border-b border-zinc-200 dark:border-zinc-700">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onBack}>
          <ArrowLeft size={16} />
        </Button>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" title="Share">
            <Share size={16} />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" title="Save">
            <Save size={16} />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" title="Debug">
            <Bug size={16} />
          </Button>
        </div>
      </div>

      {/* Webview content - Todo App */}
      <div 
        className="flex-1 bg-white dark:bg-black overflow-auto overscroll-contain"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div className="max-w-md mx-auto px-4 w-full">
          <h1 className="text-lg font-bold my-4">Todo App</h1>
          <div className="flex flex-col sm:flex-row gap-2 mb-4 w-full">
            <input 
              type="text" 
              className="flex-1 min-w-0 border border-zinc-300 dark:border-zinc-700 p-2 rounded text-sm bg-white dark:bg-black dark:text-white" 
              placeholder="Add a new todo"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button 
              className="bg-blue-500 text-white px-3 py-2 rounded text-sm w-full sm:w-auto"
              onClick={addTodo}
            >
              Add
            </button>
          </div>
          <ul className="space-y-2">
            {todos.map((todo, index) => (
              <li key={index} className="p-2 border border-zinc-200 dark:border-zinc-700 rounded flex items-center">
                <input 
                  type="checkbox" 
                  className="mr-2" 
                  checked={todo.completed}
                  onChange={() => toggleTodo(index)}
                />
                <span className={`text-sm ${todo.completed ? "line-through text-zinc-500" : ""}`}>
                  {todo.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}