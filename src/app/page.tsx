"use client";

import { useState } from "react";
import AddTaskModal from "./AddTaskModal";

type Task = {
  id: number;
  title: string;
  priority: "high" | "medium" | "low";
  deadline: string;
  estimatedTime: string;
  completed: boolean;
};

const initialTasks: Task[] = [
  {
    id: 1,
    title: "Finish presentation",
    priority: "high",
    deadline: "Friday",
    estimatedTime: "2 hours",
    completed: false,
  },
  {
    id: 2,
    title: "Read chapter 5",
    priority: "medium",
    deadline: "Tomorrow",
    estimatedTime: "45 minutes",
    completed: false,
  },
];

export default function Home() {
  const [showAddTask, setShowAddTask] = useState(false);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [draggedTaskId, setDraggedTaskId] = useState<number | null>(null);
  const [dragOverTaskId, setDragOverTaskId] = useState<number | null>(null);

  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; text: string }[]
  >([
    {
      role: "assistant",
      text: "Hi! I can help you review your tasks.",
    },
  ]);

  const handleAddTask = (newTask: Task) => {
    setTasks((currentTasks) => [...currentTasks, newTask]);
  };

  const handleToggleTask = (taskId: number) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  const handleDeleteTask = (taskId: number) => {
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== taskId)
    );
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) {
      return;
    }

    const userMessage = chatInput.trim();
    const lowerMessage = userMessage.toLowerCase();

    const pendingTasks = tasks.filter((task) => !task.completed);
    const completedTasks = tasks.filter((task) => task.completed);

    let assistantResponse = "";

    // Count pending tasks
    if (
      lowerMessage.includes("how many") ||
      lowerMessage.includes("number of") ||
      lowerMessage.includes("pending")
    ) {
      assistantResponse =
        pendingTasks.length === 0
          ? "You have no pending tasks."
          : `You have ${pendingTasks.length} pending task${
              pendingTasks.length === 1 ? "" : "s"
            }.`;
    }

    // List pending tasks
    else if (
      lowerMessage.includes("show") ||
      lowerMessage.includes("list") ||
      lowerMessage.includes("what tasks")
    ) {
      assistantResponse =
        pendingTasks.length === 0
          ? "You have no pending tasks."
          : `Your pending tasks are: ${pendingTasks
              .map((task) => task.title)
              .join(", ")}.`;
    }

    // Completed tasks
    else if (
      lowerMessage.includes("completed") ||
      lowerMessage.includes("finished") ||
      lowerMessage.includes("done")
    ) {
      assistantResponse =
        completedTasks.length === 0
          ? "You have not completed any tasks yet."
          : `You have completed ${completedTasks.length} task${
              completedTasks.length === 1 ? "" : "s"
            }: ${completedTasks.map((task) => task.title).join(", ")}.`;
    }

    // High-priority tasks
    else if (
      lowerMessage.includes("high priority") ||
      lowerMessage.includes("important")
    ) {
      const highPriorityTasks = pendingTasks.filter(
        (task) => task.priority === "high"
      );

      assistantResponse =
        highPriorityTasks.length === 0
          ? "You have no pending high-priority tasks."
          : `Your high-priority tasks are: ${highPriorityTasks
              .map((task) => task.title)
              .join(", ")}.`;
    }

    // Due tomorrow
    else if (lowerMessage.includes("tomorrow")) {
      const tomorrowTasks = pendingTasks.filter((task) =>
        task.deadline.toLowerCase().includes("tomorrow")
      );

      assistantResponse =
        tomorrowTasks.length === 0
          ? "You have no pending tasks due tomorrow."
          : `Tasks due tomorrow: ${tomorrowTasks
              .map((task) => task.title)
              .join(", ")}.`;
    }

    // Default response
    else {
      assistantResponse =
        "I can help you review your tasks. Try asking about your pending tasks, completed tasks, high-priority tasks, or tasks due tomorrow.";
    }

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        role: "user",
        text: userMessage,
      },
      {
        role: "assistant",
        text: assistantResponse,
      },
    ]);

    setChatInput("");
  };

  const handleDragStart = (taskId: number) => {
    setDraggedTaskId(taskId);
  };
  
  const handleDragOver = (
    event: React.DragEvent<HTMLDivElement>,
    taskId: number
  ) => {
    event.preventDefault();
    setDragOverTaskId(taskId);
  };
  
  const handleDrop = (taskId: number) => {
    if (draggedTaskId === null || draggedTaskId === taskId) {
      return;
    }
  
    setTasks((currentTasks) => {
      const draggedTask = currentTasks.find(
        (task) => task.id === draggedTaskId
      );
  
      if (!draggedTask) {
        return currentTasks;
      }
  
      const remainingTasks = currentTasks.filter(
        (task) => task.id !== draggedTaskId
      );
  
      const targetIndex = remainingTasks.findIndex(
        (task) => task.id === taskId
      );
  
      remainingTasks.splice(targetIndex, 0, draggedTask);
  
      return remainingTasks;
    });
  
    setDraggedTaskId(null);
    setDragOverTaskId(null);
  };
  
  const handleDragEnd = () => {
    setDraggedTaskId(null);
    setDragOverTaskId(null);
  };

  const getPriorityEmoji = (priority: Task["priority"]) => {
    if (priority === "high") return "🔴";
    if (priority === "medium") return "🟡";
    return "🟢";
  };

  return (
    <main className="min-h-screen bg-gray-100 text-gray-900">
      {/* Header */}
      <header className="border-b bg-white px-8 py-5 text-gray-900">
        <h1 className="text-2xl font-bold">TaskPilot</h1>
        <p className="text-sm text-gray-500">
          Organize your tasks. Stay on track.
        </p>
      </header>

      {/* Main content */}
      <div className="grid min-h-[calc(100vh-89px)] grid-cols-2">
        {/* Tasks */}
        <section className="border-r bg-white p-8 text-gray-900">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold">My Tasks</h2>

            <button
              onClick={() => setShowAddTask(true)}
              className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
            >
              + Add Task
            </button>
          </div>

          {tasks.map((task) => (
            <div
              key={task.id}
              draggable
              onDragStart={() => handleDragStart(task.id)}
              onDragOver={(event) => handleDragOver(event, task.id)}
              onDrop={() => handleDrop(task.id)}
              onDragEnd={handleDragEnd}
              className={`mb-4 rounded-xl border p-4 transition ${
                task.completed
                  ? "border-gray-200 bg-gray-50"
                  : "border-gray-200 bg-white"
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 cursor-pointer"
                  checked={task.completed}
                  onChange={() => handleToggleTask(task.id)}
                />

                <div className="flex-1">
                  <h3
                    className={`font-medium ${
                      task.completed
                        ? "text-gray-400 line-through"
                        : "text-gray-900"
                    }`}
                  >
                    {task.title}
                  </h3>

                  <div
                    className={`mt-2 text-sm ${
                      task.completed ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    <span>{getPriorityEmoji(task.priority)}</span>{" "}
                    Due: {task.deadline}
                  </div>

                  {task.estimatedTime && (
                    <div
                      className={`text-sm ${
                        task.completed ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Estimated: {task.estimatedTime}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="text-gray-400 hover:text-red-500"
                >
                  🗑
                </button>
              </div>
            </div>
          ))}
        </section>

        {/* AI Chat */}
        <section className="flex flex-col bg-gray-50 text-gray-900">
          <div className="border-b bg-white p-6">
            <h2 className="text-xl font-semibold">AI Chat</h2>
            <p className="text-sm text-gray-500">
              Ask TaskPilot about your tasks.
            </p>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-md rounded-xl p-4 ${
                    message.role === "user"
                      ? "bg-black text-white"
                      : "bg-white text-gray-900 shadow-sm"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t bg-white p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(event) => setChatInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleSendMessage();
                }
                }}
                placeholder="Ask TaskPilot about your tasks..."
                className="flex-1 rounded-lg border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-gray-300"
              />

              <button
                onClick={handleSendMessage}
                className="rounded-lg bg-black px-5 py-3 text-white"
              >
                ➤
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Add Task Modal */}
      {showAddTask && (
        <AddTaskModal
          onClose={() => setShowAddTask(false)}
          onAddTask={handleAddTask}
        />
      )}
    </main>
  );
}