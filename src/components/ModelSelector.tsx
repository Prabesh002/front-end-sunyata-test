import React from 'react';
import { ChevronDown } from 'lucide-react';
import { Model } from '../types';

interface ModelSelectorProps {
  models: Model[];
  selectedModel: string;
  onModelChange: (modelId: string) => void;
}

export function ModelSelector({ models, selectedModel, onModelChange }: ModelSelectorProps) {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = e.target.value;
        onModelChange(selectedValue);
    };

    return (
        <div className="relative inline-block">
            <select
                value={selectedModel}
                onChange={handleChange}
                className="appearance-none bg-gray-700 border border-gray-600 rounded-lg pl-4 pr-10 py-2 text-sm font-medium text-white hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent cursor-pointer transition-colors duration-200"
            >
                {models.map((model) => (
                    <option key={model.id} value={model.id}>
                        {model.displayName}
                    </option>
                ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
    );
}