"use client"

import React, { useState, useEffect } from "react"
import { ArrowLeft, ExternalLink, ChevronDown, ChevronUp, FileX, FileCheck, FilePlus, Edit3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WebView } from "@/components/phone/WebView"

interface ChatInterfaceProps {
  prompt: string
  isGenerating: boolean
  isComplete: boolean
  onBack: () => void
}

interface CodeDiff {
  filename: string;
  diffType: 'create' | 'edit';
  code: string;
  oldCode?: string;
  isCollapsed: boolean;
}

export function ChatInterface({ prompt, isGenerating, isComplete, onBack }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Array<{ role: "user" | "ai"; content: string }>>([])
  const [codeBlocks, setCodeBlocks] = useState<Array<CodeDiff>>([])
  const [isWebViewOpen, setIsWebViewOpen] = useState(false)
  const [operations, setOperations] = useState<Record<string, { status: string; message: string; type: string }>>({})
  const [activeTab, setActiveTab] = useState<"chat" | "code">("chat")

  useEffect(() => {
    // Initialize with user message
    setMessages([{ role: "user", content: prompt }])

    if (isGenerating) {
      // Simulate AI thinking - reduce initial delay
      const aiThinkingTimeout = setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { role: "ai", content: "I'll create that for you. Let me generate the code..." },
        ])

        // Simulate file operations
        simulateFileOperations()
      }, 300) // Reduced from 1000ms to 300ms

      return () => clearTimeout(aiThinkingTimeout)
    }

    // Pre-load code blocks immediately when complete
    if (isComplete) {
      // Add sample code blocks when generation is complete for Todo app
      setCodeBlocks([
        {
          filename: "TodoApp.tsx",
          diffType: 'create',
          code: `"use client";\n\nimport { useState } from "react";\n\nexport default function TodoApp() {\n  const [todos, setTodos] = useState([\n    { text: "Build a mobile app", completed: false },\n    { text: "Create a design", completed: true },\n    { text: "Implement streaming", completed: false }\n  ]);\n  const [input, setInput] = useState("");\n\n  const addTodo = () => {\n    if (input) {\n      setTodos([...todos, { text: input, completed: false }]);\n      setInput("");\n    }\n  };\n\n  const toggleTodo = (index) => {\n    const newTodos = [...todos];\n    newTodos[index].completed = !newTodos[index].completed;\n    setTodos(newTodos);\n  };\n\n  return (\n    <div className="p-4 max-w-md mx-auto">\n      <h1 className="text-lg font-bold mb-4">Todo App</h1>\n      <div className="flex mb-4">\n        <input\
          value={input}\
          onChange={(e) => setInput(e.target.value)}\
          className="flex-1 border p-2 rounded-l text-sm"\
          placeholder="Add a new todo"\
        />\
        <button\
          onClick={addTodo}\
          className="bg-blue-500 text-white px-4 py-2 rounded-r text-sm"\
        >\
          Add\
        </button>\
      </div>\
      <ul className="space-y-2">\
        {todos.map((todo, index) => (\
          <li key={index} className="p-2 border rounded flex items-center">\
            <input\
              type="checkbox"\
              checked={todo.completed}\
              onChange={() => toggleTodo(index)}\
              className="mr-2"\
            />\
            <span\
              className={todo.completed ? "line-through text-gray-500 text-sm" : "text-sm"}\
            >\
              {todo.text}\
            </span>\
          </li>\
        ))}\
      </ul>\
    </div>\
  );\
}`,
          isCollapsed: false,
        },
        {
          filename: "TodoList.tsx",
          diffType: 'create',
          code: `import React from 'react';\n\ninterface TodoListProps {\n  todos: Array<{ text: string; completed: boolean }>;\n  onToggle: (index: number) => void;\n}\n\nexport function TodoList({ todos, onToggle }: TodoListProps) {\n  return (\n    <ul className="space-y-2">\n      {todos.map((todo, index) => (\n        <li key={index} className="p-2 border rounded flex items-center">\n          <input\n            type="checkbox"\n            checked={todo.completed}\n            onChange={() => onToggle(index)}\n            className="mr-2"\n          />\n          <span\n            className={todo.completed ? "line-through text-gray-500 text-sm" : "text-sm"}\n          >\n            {todo.text}\n          </span>\n        </li>\n      ))}\n    </ul>\n  );\n}`,
          isCollapsed: true,
        },
        {
          filename: "TodoApp.tsx",
          diffType: 'edit',
          oldCode: `"use client";\n\nimport { useState } from "react";\n\nexport default function TodoApp() {\n  const [todos, setTodos] = useState([\n    { text: "Build a mobile app", completed: false },\n    { text: "Create a design", completed: true },\n    { text: "Implement streaming", completed: false }\n  ]);\n  const [input, setInput] = useState("");\n\n  const addTodo = () => {\n    if (input) {\n      setTodos([...todos, { text: input, completed: false }]);\n      setInput("");\n    }\n  };\n\n  const toggleTodo = (index) => {\n    const newTodos = [...todos];\n    newTodos[index].completed = !newTodos[index].completed;\n    setTodos(newTodos);\n  };\n\n  return (\n    <div className="p-4 max-w-md mx-auto">\n      <h1 className="text-lg font-bold mb-4">Todo App</h1>\n      <div className="flex mb-4">\n        <input\
          type="text"\
          value={input}\
          onChange={(e) => setInput(e.target.value)}\
          className="flex-1 border p-2 rounded-l text-sm"\
          placeholder="Add a new todo"\
        />\
        <button\
          onClick={addTodo}\
          className="bg-blue-500 text-white px-4 py-2 rounded-r text-sm"\
        >\
          Add\
        </button>\
      </div>\n      <ul className="space-y-2">\n        {todos.map((todo, index) => (\
          <li key={index} className="p-2 border rounded flex items-center">\
            <input\
              type="checkbox"\
              checked={todo.completed}\
              onChange={() => toggleTodo(index)}\
              className="mr-2"\
            />\
            <span\
              className={todo.completed ? "line-through text-gray-500 text-sm" : "text-sm"}\
            >\
              {todo.text}\
            </span>\
          </li>\
        ))}\n      </ul>\n    </div>\n  );\n}`,
          code: `"use client";\n\nimport { useState } from "react";\nimport { TodoList } from "./TodoList";\n\nexport default function TodoApp() {\n  const [todos, setTodos] = useState([\n    { text: "Build a mobile app", completed: false },\n    { text: "Create a design", completed: true },\n    { text: "Implement streaming", completed: false }\n  ]);\n  const [input, setInput] = useState("");\n\n  const addTodo = () => {\n    if (input) {\n      setTodos([...todos, { text: input, completed: false }]);\n      setInput("");\n    }\n  };\n\n  const toggleTodo = (index) => {\n    const newTodos = [...todos];\n    newTodos[index].completed = !newTodos[index].completed;\n    setTodos(newTodos);\n  };\n\n  return (\n    <div className="p-4 max-w-md mx-auto">\n      <h1 className="text-lg font-bold mb-4">Todo App</h1>\n      <div className="flex mb-4">\n        <input\
          type="text"\
          value={input}\
          onChange={(e) => setInput(e.target.value)}\
          className="flex-1 border p-2 rounded-l text-sm"\
          placeholder="Add a new todo"\
        />\
        <button\
          onClick={addTodo}\
          className="bg-blue-500 text-white w-16 px-2 py-2 rounded-r text-sm"\
        >\
          Add\
        </button>\
      </div>\n      <TodoList todos={todos} onToggle={toggleTodo} />\n    </div>\n  );\n}`,
          isCollapsed: true,
        },
        {
          filename: "package.json",
          diffType: 'edit',
          oldCode: `{\n  "name": "todo-app",\n  "version": "0.1.0",\n  "private": true,\n  "dependencies": {\n    "react": "^18.2.0",\n    "react-dom": "^18.2.0"\n  }\n}`,
          code: `{\n  "name": "todo-app",\n  "version": "0.1.0",\n  "private": true,\n  "dependencies": {\n    "react": "^18.2.0",\n    "react-dom": "^18.2.0",\n    "tailwindcss": "^3.3.0",\n    "postcss": "^8.4.24",\n    "autoprefixer": "^10.4.14"\n  }\n}`,
          isCollapsed: true,
        }
      ]);

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content:
            "I've created a simple Todo app with the following features:\n\n- Add new todos\n- Mark todos as complete\n- Shows sample todos to get started\n- Improved component structure for better maintainability",
        },
      ]);
    }
  }, [prompt, isGenerating, isComplete]);

  const simulateFileOperations = () => {
    // Simulate file operations with faster status updates
    setTimeout(() => {
      setOperations((prev) => ({
        ...prev,
        "package.json": { status: "editing", message: "Updating package.json...", type: "edit" },
      }));
    }, 100); // Reduced from 500ms

    setTimeout(() => {
      setOperations((prev) => ({
        ...prev,
        "TodoApp.tsx": { status: "creating", message: "Creating TodoApp.tsx...", type: "create" },
      }));
    }, 250); // Reduced from 1500ms

    setTimeout(() => {
      setOperations((prev) => ({
        ...prev,
        "package.json": { status: "edited", message: "Updated package.json", type: "edit" },
      }));
    }, 400); // Reduced from 2500ms

    setTimeout(() => {
      setOperations((prev) => ({
        ...prev,
        "TodoList.tsx": { status: "creating", message: "Creating TodoList.tsx...", type: "create" },
      }));
    }, 550); // Reduced from 3000ms

    setTimeout(() => {
      setOperations((prev) => ({
        ...prev,
        "TodoApp.tsx": { status: "created", message: "Created TodoApp.tsx", type: "create" },
      }));
      
      // Add code blocks faster, right after the first operation completes
      setCodeBlocks([
        {
          filename: "TodoApp.tsx",
          diffType: 'create',
          code: `"use client";\n\nimport { useState } from "react";\n\nexport default function TodoApp() {\n  const [todos, setTodos] = useState([\n    { text: "Build a mobile app", completed: false },\n    { text: "Create a design", completed: true },\n    { text: "Implement streaming", completed: false }\n  ]);\n  const [input, setInput] = useState("");\n\n  const addTodo = () => {\n    if (input) {\n      setTodos([...todos, { text: input, completed: false }]);\n      setInput("");\n    }\n  };\n\n  const toggleTodo = (index) => {\n    const newTodos = [...todos];\n    newTodos[index].completed = !newTodos[index].completed;\n    setTodos(newTodos);\n  };\n\n  return (\n    <div className="p-4 max-w-md mx-auto">\n      <h1 className="text-lg font-bold mb-4">Todo App</h1>\n      <div className="flex mb-4">\n        <input\
          value={input}\
          onChange={(e) => setInput(e.target.value)}\
          className="flex-1 border p-2 rounded-l text-sm"\
          placeholder="Add a new todo"\
        />\
        <button\
          onClick={addTodo}\
          className="bg-blue-500 text-white px-4 py-2 rounded-r text-sm"\
        >\
          Add\
        </button>\
      </div>\
      <ul className="space-y-2">\
        {todos.map((todo, index) => (\
          <li key={index} className="p-2 border rounded flex items-center">\
            <input\
              type="checkbox"\
              checked={todo.completed}\
              onChange={() => toggleTodo(index)}\
              className="mr-2"\
            />\
            <span\
              className={todo.completed ? "line-through text-gray-500 text-sm" : "text-sm"}\
            >\
              {todo.text}\
            </span>\
          </li>\
        ))}\
      </ul>\
    </div>\
  );\
}`,
          isCollapsed: false,
        },
        {
          filename: "package.json",
          diffType: 'edit',
          oldCode: `{\n  "name": "todo-app",\n  "version": "0.1.0",\n  "private": true,\n  "dependencies": {\n    "react": "^18.2.0",\n    "react-dom": "^18.2.0"\n  }\n}`,
          code: `{\n  "name": "todo-app",\n  "version": "0.1.0",\n  "private": true,\n  "dependencies": {\n    "react": "^18.2.0",\n    "react-dom": "^18.2.0",\n    "tailwindcss": "^3.3.0",\n    "postcss": "^8.4.24",\n    "autoprefixer": "^10.4.14"\n  }\n}`,
          isCollapsed: true,
        }
      ]);
    }, 700); // Reduced from 4000ms

    setTimeout(() => {
      setOperations((prev) => ({
        ...prev,
        "TodoList.tsx": { status: "created", message: "Created TodoList.tsx", type: "create" },
      }));
      
      // Update code blocks with the TodoList component
      setCodeBlocks(prev => [...prev, {
        filename: "TodoList.tsx",
        diffType: 'create',
        code: `import React from 'react';\n\ninterface TodoListProps {\n  todos: Array<{ text: string; completed: boolean }>;\n  onToggle: (index: number) => void;\n}\n\nexport function TodoList({ todos, onToggle }: TodoListProps) {\n  return (\n    <ul className="space-y-2">\n      {todos.map((todo, index) => (\n        <li key={index} className="p-2 border rounded flex items-center">\n          <input\n            type="checkbox"\n            checked={todo.completed}\n            onChange={() => onToggle(index)}\n            className="mr-2"\n          />\n          <span\n            className={todo.completed ? "line-through text-gray-500 text-sm" : "text-sm"}\n          >\n            {todo.text}\n          </span>\n        </li>\n      ))}\n    </ul>\n  );\n}`,
        isCollapsed: true,
      }]);
    }, 850); // Reduced from 4500ms

    setTimeout(() => {
      setOperations((prev) => ({
        ...prev,
        "TodoApp.tsx": { status: "editing", message: "Refactoring TodoApp.tsx...", type: "edit" },
      }));
    }, 1000); // Reduced from 5000ms

    setTimeout(() => {
      setOperations((prev) => ({
        ...prev,
        "TodoApp.tsx": { status: "edited", message: "Refactored TodoApp.tsx", type: "edit" },
      }));
      
      // Update the TodoApp.tsx with edited content
      setCodeBlocks(prev => {
        const newBlocks = [...prev];
        const todoAppIndex = newBlocks.findIndex(block => block.filename === "TodoApp.tsx");
        
        if (todoAppIndex !== -1) {
          newBlocks.push({
            filename: "TodoApp.tsx",
            diffType: 'edit',
            oldCode: newBlocks[todoAppIndex].code,
            code: `"use client";\n\nimport { useState } from "react";\nimport { TodoList } from "./TodoList";\n\nexport default function TodoApp() {\n  const [todos, setTodos] = useState([\n    { text: "Build a mobile app", completed: false },\n    { text: "Create a design", completed: true },\n    { text: "Implement streaming", completed: false }\n  ]);\n  const [input, setInput] = useState("");\n\n  const addTodo = () => {\n    if (input) {\n      setTodos([...todos, { text: input, completed: false }]);\n      setInput("");\n    }\n  };\n\n  const toggleTodo = (index) => {\n    const newTodos = [...todos];\n    newTodos[index].completed = !newTodos[index].completed;\n    setTodos(newTodos);\n  };\n\n  return (\n    <div className="p-4 max-w-md mx-auto">\n      <h1 className="text-lg font-bold mb-4">Todo App</h1>\n      <div className="flex mb-4">\n        <input\
          type="text"\
          value={input}\
          onChange={(e) => setInput(e.target.value)}\
          className="flex-1 border p-2 rounded-l text-sm"\
          placeholder="Add a new todo"\
        />\
        <button\
          onClick={addTodo}\
          className="bg-blue-500 text-white w-16 px-2 py-2 rounded-r text-sm"\
        >\
          Add\
        </button>\
      </div>\n      <TodoList todos={todos} onToggle={toggleTodo} />\n    </div>\n  );\n}`,
            isCollapsed: true,
          });
        }
        
        return newBlocks;
      });
      
      // Add final message
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content:
            "I've created a simple Todo app with the following features:\n\n- Add new todos\n- Mark todos as complete\n- Shows sample todos to get started\n- Improved component structure for better maintainability",
        },
      ]);
    }, 1200); // Reduced from 6000ms
  };

  const toggleCodeBlock = (index: number) => {
    setCodeBlocks((prev) =>
      prev.map((block, i) => (i === index ? { ...block, isCollapsed: !block.isCollapsed } : block)),
    );
  };

  if (isWebViewOpen) {
    return <WebView onBack={() => setIsWebViewOpen(false)} />;
  }

  // Function to render code with diff highlighting
  const renderCodeWithDiff = (block: CodeDiff) => {
    if (block.diffType === 'create') {
      // For created files, all lines are additions (green)
      return (
        <pre className="p-3 bg-zinc-900 text-zinc-100 overflow-x-auto text-[10px] max-h-40">
          <code>
            {block.code.split('\n').map((line, i) => (
              <div key={i} className="text-green-400">+ {line}</div>
            ))}
          </code>
        </pre>
      );
    } else if (block.diffType === 'edit' && block.oldCode) {
      // For edited files, compute a simple diff
      const oldLines = block.oldCode.split('\n');
      const newLines = block.code.split('\n');
      
      // Simple diff view - not a true diff algorithm but works for demo
      return (
        <pre className="p-3 bg-zinc-900 text-zinc-100 overflow-x-auto text-[10px] max-h-40">
          <code>
            {newLines.map((line, i) => {
              if (i >= oldLines.length) {
                // New lines added
                return <div key={`new-${i}`} className="text-green-400">+ {line}</div>;
              }
              if (line !== oldLines[i]) {
                // Changed line
                return (
                  <React.Fragment key={`change-${i}`}>
                    <div className="text-red-400">- {oldLines[i]}</div>
                    <div className="text-green-400">+ {line}</div>
                  </React.Fragment>
                );
              }
              // Unchanged line
              return <div key={`same-${i}`}>{line}</div>;
            })}
          </code>
        </pre>
      );
    }
    
    // Fallback for any other case
    return (
      <pre className="p-3 bg-zinc-900 text-zinc-100 overflow-x-auto text-[10px] max-h-40">
        <code>{block.code}</code>
      </pre>
    );
  };

  // Get icon based on operation type
  const getOperationIcon = (type: string, status: string) => {
    if (type === 'create') {
      return status === 'creating' ? <FilePlus size={12} className="text-blue-400 mr-1 animate-pulse" /> : <FilePlus size={12} className="text-green-400 mr-1" />;
    } else if (type === 'edit') {
      return status === 'editing' ? <Edit3 size={12} className="text-blue-400 mr-1 animate-pulse" /> : <Edit3 size={12} className="text-green-400 mr-1" />;
    } else if (type === 'delete') {
      return status === 'deleting' ? <FileX size={12} className="text-blue-400 mr-1 animate-pulse" /> : <FileX size={12} className="text-red-400 mr-1" />;
    }
    return <FileCheck size={12} className="text-blue-400 mr-1" />;
  };

  return (
    <div className="flex flex-col h-full select-none touch-manipulation">
      {/* Header */}
      <div className="flex items-center p-2 border-b border-zinc-200 dark:border-zinc-800">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onBack}>
          <ArrowLeft size={16} />
        </Button>
        <h2 className="text-sm font-medium ml-2">Chat</h2>
      </div>

      {/* Tab navigation */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-800">
        <button
          className={`flex-1 py-2 text-center font-medium text-xs ${
            activeTab === "chat" ? "text-blue-500 border-b-2 border-blue-500" : "text-zinc-500 dark:text-zinc-400"
          }`}
          onClick={() => setActiveTab("chat")}
        >
          Chat
        </button>
        <button
          className={`flex-1 py-2 text-center font-medium text-xs ${
            activeTab === "code" ? "text-blue-500 border-b-2 border-blue-500" : "text-zinc-500 dark:text-zinc-400"
          }`}
          onClick={() => setActiveTab("code")}
        >
          Code
        </button>
      </div>

      {/* Chat content */}
      {activeTab === "chat" && (
        <div 
          className="flex-1 overflow-auto p-3 space-y-3 overscroll-contain"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] p-2 rounded-lg text-xs ${
                  message.role === "user" ? "bg-blue-500 text-white" : "bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}

          {/* Enhanced Activity log with icons */}
          {Object.keys(operations).length > 0 && (
            <div className="bg-zinc-50 dark:bg-zinc-900 p-2 rounded-lg border border-zinc-200 dark:border-zinc-800">
              <h3 className="text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">ACTIVITY</h3>
              {Object.entries(operations).map(([key, op]) => (
                <div key={key} className="text-xs text-zinc-600 dark:text-zinc-400 mb-1 flex items-center">
                  {getOperationIcon(op.type, op.status)}
                  {op.message}
                </div>
              ))}
            </div>
          )}

          {/* CTA button */}
          {isComplete && (
            <div className="flex justify-center mt-3">
              <Button 
                size="sm"
                className="flex items-center gap-1 text-xs h-8" 
                onClick={() => setIsWebViewOpen(true)}
              >
                Open App <ExternalLink size={12} />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Code content */}
      {activeTab === "code" && (
        <div 
          className="flex-1 overflow-auto p-3 space-y-3 overscroll-contain"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {/* Code blocks with diff view */}
          {codeBlocks.map((block, index) => (
            <div key={index} className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
              <div
                className="flex justify-between items-center p-2 bg-zinc-100 dark:bg-zinc-800 cursor-pointer"
                onClick={() => toggleCodeBlock(index)}
              >
                <div className="flex items-center">
                  {block.diffType === 'create' ? 
                    <FilePlus size={14} className="mr-1 text-green-500" /> : 
                    <Edit3 size={14} className="mr-1 text-blue-500" />
                  }
                  <span className="font-mono text-xs">{block.filename}</span>
                </div>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  {block.isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                </Button>
              </div>
              {!block.isCollapsed && renderCodeWithDiff(block)}
            </div>
          ))}

          {/* Show CTA button in code tab too */}
          {isComplete && (
            <div className="flex justify-center mt-3">
              <Button 
                size="sm"
                className="flex items-center gap-1 text-xs h-8" 
                onClick={() => setIsWebViewOpen(true)}
              >
                Open App <ExternalLink size={12} />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
} 