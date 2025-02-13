import React, { useState } from 'react';

import './App.css';
import Board from './components/Board/Board';
import GameSettings from './components/Form/GameSettings';
import { FormType } from './components/FormType';

function App() {
  const [formData, setFormData] = useState<FormType>({
    size: 9,
    animal: 'wolf', // Default value for the radio
    animalCount: 3, // Default number of wolves/sheep
  });


  return (
    <div className='flex-row'>
    <div className='game-setting'>
    <GameSettings formData={formData} setFormData={setFormData} />

    </div>
    <div id="app">
     <Board size={formData.size} animal={formData.animal} animalCount={formData.animalCount}></Board>
    </div>
    </div>
  );
}

export default App;
