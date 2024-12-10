import React from 'react';

interface ProjectNotesProps {
  initialValues?: any;
}

export function ProjectNotes({ initialValues }: ProjectNotesProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">Project Notes</label>
      <textarea
        name="notes"
        rows={4}
        defaultValue={initialValues?.notes}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      />
    </div>
  );
}