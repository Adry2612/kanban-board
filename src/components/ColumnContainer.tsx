import { Column, Task } from '../types';
import TaskContainer from './TaskContainer';
import TrashIcon from './Icons/TrashIcon';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useContext, useMemo, useState } from 'react';
import Plusicon from './Icons/Plusicon';
import { KanbanContext, KanbanContextType } from '../context/KanbanContext';

interface Props {
  column: Column;
  tasks: Task[];
}

export default function ColumnContainer(props: Props) {
  const { column, tasks } = props;
  const { counter, deleteColumn, updateColumn, createTask } = useContext(KanbanContext) as KanbanContextType;

  const [editMode, setEditMode] = useState(false);
  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);

  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: column.id,
    data: {
      type: 'Column',
      column,
    },
    disabled: editMode,
  })

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  }

  if (isDragging) {
    return (
      <div key={column.id} ref={setNodeRef} style={style} className='bg-columnBackgroundColor opacity-40 border-2 border-rose-500 w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col'></div>
    )
  }

  return (
    <div
      {...attributes}
      {...listeners}
      key={column.id}
      ref={setNodeRef}
      style={style}
      className='bg-columnBackgroundColor w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col border-columnBackgroundColor border-4'>
      <div className='bg-mainBackgroundColor text-md h-[60px] cursor-grab rounded-md rounded-b-none p-3 font-bold flex items-center justify-between '>
        <div className='flex gap-2' onClick={() => setEditMode(true)}>
          <div className='flex items-center justify-center px-2 py-1 text-sm rounded-full flex-center bg-columnBackgroundColor'> {counter.toString()} </div>
          {!editMode
            ? column.title
            : <input value={column.title}
              autoFocus
              onChange={(e) => updateColumn(column.id, e.target.value)}
              onBlur={(e) => setEditMode(false)}
              onKeyDown={(e) => {
                if (e.key !== 'Enter') return;
                setEditMode(false);
              }}
              className='px-2 bg-black border rounded outline-none focus:border-rose-500' />
          }
        </div>
        <button onClick={() => deleteColumn(column.id)} className='px-1 py-2 rounded stroke-gray-500 hover:stroke-white hover:bg-columnBackgroundColor'>
          <TrashIcon />
        </button>
      </div>

      <div className='flex flex-col flex-grow gap-4 p-2 overflow-x-hidden overflow-y-auto'>
        <SortableContext items={tasksIds}>
          {tasks.map((task) => (
            <TaskContainer key={task.id} task={task} />
          ))}
        </SortableContext>
      </div>

      <button onClick={() => createTask(column)} className='flex items-center gap-2 p-4 border-2 rounded-md border-columnBackgroundColor border-x-columnBackgroundColor hover:bg-mainBackgroundColor hover:text-rose-500 active:bg-black'>
        <Plusicon />
        Add task
      </button>
    </div>
  )
}
