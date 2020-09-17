import React from 'react';
import logo from './logo.svg';
import './App.css';
import GearSelect from './components/GearSelect'
import GearWidget from './components/GearWidget'
import AddGearButton from './components/AddGearButton'
import { fetchUserGear, Gear, toggleGearTracking, deleteGear, addGear } from './api'

function App() {

  const [gear, setGear] = React.useState<Gear[]>([])

  const getGear = () => {
    const run = async() => {
      const json = await fetchUserGear()
      setGear(json)
    }
    run()
  }

  const gearWidgets = gear.map(g => {
    return <GearWidget 
              gearName={g.name} 
              gearMileage={g.mileage}
              toggleGearTracking={toggleGearTracking} 
              is_tracked={g.is_tracked}
              getGear={getGear}
              deleteGear={deleteGear}
              addGear={addGear}
            />
  })
  
  React.useEffect(getGear, [])

  return (
    <div>
      {gearWidgets}
      <AddGearButton 
        addGear={addGear}
        getGear={getGear}
      />
    </div>
  );
}

export default App;
