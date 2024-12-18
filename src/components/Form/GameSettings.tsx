import React from 'react';
import { useForm } from 'react-hook-form';
import { FormType } from '../FormType';

interface GameSettingsFormData {
    gridSize: number;
    character: 'wolf' | 'sheep';
    numCharacters: number;
}

interface GameSettingsProps {
    formData: FormType;
    setFormData: React.Dispatch<React.SetStateAction<FormType>>;
  }
  


export default function GameSettings({ formData, setFormData }: GameSettingsProps) {
    const { register, handleSubmit, formState: { errors } } = useForm<GameSettingsFormData>();
    
    const onSubmit = (data: GameSettingsFormData) => {
        setFormData({
            animal:data.character,
            animalCount:data.numCharacters,
            size:data.gridSize
        })
    };

    return (
        <div className="game-setting p-6 max-w-md mx-auto bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Game Settings</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                
                {/* Grid Size Dropdown */}
                <div>
                    <label htmlFor="grid-size" className="block text-sm font-medium text-gray-700">Grid Size:</label>
                    <select
                        id="grid-size"
                        {...register("gridSize", { required: true, valueAsNumber: true })}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                        {Array.from({ length: 9 }, (_, i) => i + 2).map(size => (
                            <option key={size} value={size}>{size}</option>
                        ))}
                    </select>
                    {errors.gridSize && <p className="text-red-500 text-xs mt-1">Grid size is required.</p>}
                </div>

                {/* Radio Buttons for Character */}
                <fieldset className="space-y-2">
                    <legend className="block text-sm font-medium text-gray-700">Select Character:</legend>
                    <div className="flex items-center space-x-4">
                        <label className="flex items-center">
                            <input type="radio" value="wolf" {...register("character", { required: true })} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300" />
                            <span className="ml-2 text-gray-700">Wolf</span>
                        </label>
                        <label className="flex items-center">
                            <input type="radio" value="sheep" {...register("character", { required: true })} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300" />
                            <span className="ml-2 text-gray-700">Sheep</span>
                        </label>
                    </div>
                    {errors.character && <p className="text-red-500 text-xs mt-1">Character selection is required.</p>}
                </fieldset>

                {/* Number of Wolves/Sheep */}
                <div>
                    <label htmlFor="num-characters" className="block text-sm font-medium text-gray-700">Number of Wolf/Sheep:</label>
                    <input
                        type="number"
                        id="num-characters"
                        {...register("numCharacters", { required: true, valueAsNumber: true, min: 1 })}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {errors.numCharacters && <p className="text-red-500 text-xs mt-1">Please enter a valid number (min 1).</p>}
                </div>

                <button type="submit" className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Generate Grid</button>
                

            </form>
        </div>
    );
}
