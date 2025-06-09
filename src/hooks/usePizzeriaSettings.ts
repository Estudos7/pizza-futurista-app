
import { useState } from 'react';
import { initialPizzeriaInfo } from '../data/initialData';

export const usePizzeriaSettings = () => {
  const [pizzeriaInfo, setPizzeriaInfo] = useState(initialPizzeriaInfo);

  const updatePizzeriaInfo = (info: typeof initialPizzeriaInfo) => {
    setPizzeriaInfo(info);
  };

  return {
    pizzeriaInfo,
    updatePizzeriaInfo
  };
};
