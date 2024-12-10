import React from 'react';

interface ProjectDetailsProps {
  initialValues?: any;
}

export function ProjectDetails({ initialValues }: ProjectDetailsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Project Name</label>
        <input
          type="text"
          name="name"
          required
          defaultValue={initialValues?.name}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Project Image URL</label>
        <input
          type="url"
          name="imageUrl"
          defaultValue={initialValues?.imageUrl}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Total Homes Passed</label>
        <input
          type="number"
          name="homesPassed"
          required
          min="0"
          defaultValue={initialValues?.homesPassed}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Current Customers</label>
        <input
          type="number"
          name="currentCustomers"
          required
          min="0"
          defaultValue={initialValues?.currentCustomers}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
    </div>
  );
}