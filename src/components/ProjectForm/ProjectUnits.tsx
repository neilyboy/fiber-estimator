import React from 'react';
import { Unit, ProjectUnit } from '../../types';

interface ProjectUnitsProps {
  units: Unit[];
  selectedUnits: ProjectUnit[];
  onUnitChange: (unitId: string, quantity: number) => void;
}

export function ProjectUnits({ units, selectedUnits, onUnitChange }: ProjectUnitsProps) {
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Project Units</h3>
      <div className="space-y-4">
        {units.map((unit) => (
          <div key={unit.id} className="flex items-center space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">
                {unit.name} (${unit.cost}/{unit.type})
              </label>
              <input
                type="number"
                min="0"
                step={unit.type === 'foot' ? '1' : '0.01'}
                value={selectedUnits.find(u => u.unitId === unit.id)?.quantity || ''}
                onChange={(e) => onUnitChange(unit.id, Number(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}