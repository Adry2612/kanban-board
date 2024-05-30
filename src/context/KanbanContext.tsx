import { PropsWithChildren, createContext, useState } from "react";
import { Column, Id, Task } from "../types";
import { v4 as uuidv4 } from 'uuid';

export type KanbanContextType = {
  columns: Column[],
  tasks: Task[],
  counter: Number,
  setColumns: (columns: any) => void;
  setTasks: (tasks: any) => void;
  createNewColumn: () => void;
  deleteColumn: (id: Id) => void;
  updateColumn: (id: Id, title: string) => void;
  createTask: (activeColumn: Column) => void;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
};

export const KanbanContext = createContext<KanbanContextType | undefined>(undefined);

export default function KanbanProvider({ children }: PropsWithChildren) {
  const [columns, setColumns] = useState<Column[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [counter, setCounter] = useState(0);

  const createNewColumn = () => {
    const columnToAdd: Column = {
      id: uuidv4(),
      title: `Column ${columns.length + 1}`,
      tasks: [],
    };

    setCounter((prevCount) => prevCount + 1);
    setColumns(prevColumns => [...prevColumns, columnToAdd]);
  };

  const deleteColumn = (id: Id) => {
    const filteredColumns = columns.filter((col) => col.id !== id);
    setColumns(filteredColumns);

    const newTasks = tasks.filter((task) => task.columnId !== id);
    setTasks(newTasks);
  };

  const updateColumn = (id: Id, title: string) => {
    const updatedColumns = columns.map((col) => {
      if (col.id === id) {
        return { ...col, title };
      }
      return col;
    });
    setColumns(updatedColumns);
  };

  const createTask = (activeColumn: Column) => {
    const taskToAdd: Task = {
      id: uuidv4(),
      content: `Task ${tasks.length + 1}`,
      columnId: activeColumn.id,
    };

    setTasks(prevTasks => [...prevTasks, taskToAdd]);
  }

  const deleteTask = (id: Id) => {
    const filteredTask = tasks.filter((task) => task.id !== id);
    setTasks(filteredTask);
  }

  const updateTask = (id: Id, content: string) => {
    const updatedTask = tasks.map((task) => {
      if (task.id === id) {
        return { ...task, content };
      }
      return task;
    });
    setTasks(updatedTask);
  };

  return (
    <KanbanContext.Provider
      value={{
        columns,
        tasks,
        counter,
        setColumns,
        setTasks,
        createNewColumn,
        deleteColumn,
        updateColumn,
        createTask,
        deleteTask,
        updateTask,
      }}>
      {children}
    </KanbanContext.Provider>
  )
}
