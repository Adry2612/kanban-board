import { useMemo, useState, useContext } from 'react'
import Plusicon from './Icons/Plusicon'
import { Column, Task } from '../types';
import ColumnContainer from './ColumnContainer';
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';
import { KanbanContext, KanbanContextType } from '../context/KanbanContext';
import TaskContainer from './TaskContainer';

export default function KanbanBoard() {
  const { columns, tasks, setColumns, setTasks, createNewColumn } = useContext(KanbanContext) as KanbanContextType;

  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  function onDragstart(event: DragStartEvent) {
    if (event.active.data.current?.type === 'Column') {
      setActiveColumn(event.active.data.current.column);
      return;
    }

    if (event.active.data.current?.type === 'Task') {
      setActiveTask(event.active.data.current.task);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    setColumns((columns: Column[]) => {
      const activeColumnIndex = columns.findIndex((col) => col.id === activeId);
      const overColumnIndex = columns.findIndex((col) => col.id === overId);

      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === 'Task';
    const isOverTask = over.data.current?.type === 'Task';

    if (!isActiveTask) return;

    if (isActiveTask && isOverTask) {
      setTasks((tasks: Task[]) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        tasks[activeIndex].columnId = tasks[overIndex].columnId;

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverColumn = over.data.current?.type === 'Column';

    if (isActiveTask && isOverColumn) {
      setTasks((tasks: Task[]) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);

        tasks[activeIndex].columnId = overId;

        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  }

  return (
    <div className='m-auto flex min-h-screen w-full items-center justify-center overflow-x-auto overflow-y-hidden px-[40px]'>
      <DndContext
        onDragStart={onDragstart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
        sensors={sensors}>
        <div className='flex gap-4 m-auto'>
          <div className='flex gap-4'>
            <SortableContext items={columnsId}>
              {columns.map((column) => (
                <ColumnContainer
                  key={column.id}
                  column={column}
                  tasks={tasks.filter((task) => task.columnId === column.id)} />
              ))}
            </SortableContext>
          </div>
          <button onClick={() => createNewColumn()}
            className='h-[60px] w-[350px] min-w-[350px] cursor-pointer rounded-lg bg-columnBackgroundColor border-2 border-columnBackgroundColor p-4 ring-rose-500 flex gap-2 hover:ring-2 '>
            Add Column
            <Plusicon />
          </button>
        </div>

        {
          createPortal(
            <DragOverlay>
              {activeColumn && (
                <ColumnContainer
                  key={activeColumn.id}
                  column={activeColumn}
                  tasks={tasks.filter((task) => task.columnId === activeColumn.id)}
                />
              )}
              {activeTask && <TaskContainer task={activeTask} />}
            </DragOverlay>, document.body
          )
        }
      </DndContext >
    </div >
  )
}
