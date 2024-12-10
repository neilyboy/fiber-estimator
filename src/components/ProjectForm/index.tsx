import React from 'react';
import { Unit, ProjectUnit, LaborRate, ProjectLaborRate, MileageRate, ProjectMileageRate } from '../../types';
import { ProjectDetails } from './ProjectDetails';
import { ProjectNotes } from './ProjectNotes';
import { ProjectUnits } from './ProjectUnits';

interface ProjectFormProps {
  onSubmit: (formData: FormData) => void;
  units: Unit[];
  laborRates: LaborRate[];
  mileageRates: MileageRate[];
  selectedUnits: ProjectUnit[];
  selectedLaborRates: ProjectLaborRate[];
  selectedMileageRates: ProjectMileageRate[];
  onUnitChange: (unitId: string, quantity: number) => void;
  onLaborRateChange: (rateId: string, quantity: number) => void;
  onMileageRateChange: (rateId: string, trips: number) => void;
  initialValues?: any;
}

function ProjectForm({
  onSubmit,
  units,
  selectedUnits,
  onUnitChange,
  initialValues,
}: ProjectFormProps) {
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      onSubmit(new FormData(e.currentTarget));
    }} className="space-y-6">
      <ProjectDetails initialValues={initialValues} />
      <ProjectNotes initialValues={initialValues} />
      <ProjectUnits
        units={units}
        selectedUnits={selectedUnits}
        onUnitChange={onUnitChange}
      />

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Save Project
        </button>
      </div>
    </form>
  );
}

export default ProjectForm;