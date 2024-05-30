import { useContext, useState } from 'react';
import { Task } from '../types'
import TrashIcon from './Icons/TrashIcon';
import { KanbanContext, KanbanContextType } from '../context/KanbanContext';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Props {
  task: Task;
}

export default function TaskContainer({ task }: Props) {
  const [editMode, setEditMode] = useState(false);
  console.log('🚀 ~ file: TaskContainer.tsx:14 ~ TaskContainer ~ editMode:', editMode);

  const { deleteTask, updateTask } = useContext(KanbanContext) as KanbanContextType;
  const [mouseIsOver, setMouseIsOver] = useState(false)

  const toggleEditMode = () => {
    setEditMode((prevEditMode) => !prevEditMode)
    setMouseIsOver(false);
  }

  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  }

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className='bg-mainBackgroundColor p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grabs relative opacity-30 border-2 border-rose-500 task'></div>
    )
  }

  if (editMode) {
    return (
      <div
        {...attributes}
        {...listeners}
        key={task.id}
        ref={setNodeRef}
        style={style}
        className='bg-mainBackgroundColor p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grabs relative'>
        <textarea
          value={task.content}
          autoFocus
          onBlur={toggleEditMode}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.shiftKey) toggleEditMode()
          }}
          onChange={e => updateTask(task.id, e.target.value)}
          placeholder='Task content here' className='h-[90%] w-full resize-none border-none rounded bg-transparent text-white focus:outline-none '></textarea>
      </div>
    )
  }

  return (
    <div
      {...attributes}
      {...listeners}
      key={task.id}
      ref={setNodeRef}
      style={style}
      onMouseEnter={() => setMouseIsOver(true)}
      onMouseLeave={() => setMouseIsOver(false)}
      onClick={toggleEditMode}
      className='bg-mainBackgroundColor p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grabs relative task'>
      <p className='my-auto h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap'> {task.content} </p>
      {mouseIsOver && (
        <button
          onClick={() => deleteTask(task.id)}
          className='absolute p-2 -translate-y-1/2 rounded stroke-white right-4 top-1/2 bg-columnBackgroundColor opacity-60 hover:opacity-100'
        >
          <TrashIcon />
        </button>
      )}
    </div>
  )
}
