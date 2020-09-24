import React from 'react';
import logo from './logo.svg';
import './App.css';
import GearSelect from './components/GearSelect'
import GearWidget from './components/GearWidget'
import AddGearWidget from './components/AddGearWidget'

import { fetchAuthorizationStatus, fetchUserGear, Gear, toggleGearTracking, deleteGear } from './api'

function App() {

  const [gear, setGear] = React.useState<Gear[]>([])
  const [authorized, setAuthorized] = React.useState<boolean>()

  const getAuthorizationStatus = () => {
    const run = async() => {
      const json = await fetchAuthorizationStatus()
      console.log(json.authorized)
      setAuthorized(json.authorized)
    }
    run()
  }

  const getGear = () => {
    const run = async() => {
      const json = await fetchUserGear()     
      console.log('Authorized?: ', json)
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
            />
  })

  React.useEffect(getAuthorizationStatus, [])
  React.useEffect(getGear, [])

  return (
    <div>
      {authorized
        ? <div>
            {gearWidgets}
            <AddGearWidget getGear={getGear}/>
          </div>
        : <button>Authorize</button>
      }
      
    </div>
  );
}

export default App;
