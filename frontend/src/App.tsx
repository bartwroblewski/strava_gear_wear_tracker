import React from 'react';
import ReactDOM from 'react-dom'
import { authorizeUrl } from './urls'
import './components/css/App.css'
import Test from './components/Test'
import { GearWidget, AddGearWidget } from './components/GearWidget'
import UnitSwitch from './components/UnitSwitch'

import { 
  fetchAuthorizationStatus, 
  fetchUserGear, 
  refreshAthleteBikes,
  Gear, 
  Bike, 
  toggleGearTracking,
  deleteGear, 
  addGear, 
  addOrChangeGear,
  changeAthlete,
} from './api'

interface GearWidgetSubmitParams {
  name: string,
  pk?: string,
  distance?: number,
  movingTime?: number,
  bikeId?: string,
  track?: boolean,
}

function App() {

  const [gear, setGear] = React.useState<Gear[]>([])
  const [authorized, setAuthorized] = React.useState<boolean>()
  const [bikes, setBikes] = React.useState<Bike[]>([])

  const getAuthorizationStatus = () => {
    const run = async() => {
      const json = await fetchAuthorizationStatus()
      console.log('Authorized?: ',json.authorized)
      setAuthorized(json.authorized)
    }
    run()
  }
  
  const getGear = () => {
    const run = async() => {
      const json = await fetchUserGear()     
      console.log('User gear: ', json)
      setGear(json)
    }
    run()
  }

  const refreshAthBikes = () => {
    const run = async() => {
      const json = await refreshAthleteBikes()    
      console.log('Athlete bikes: ', json) 
      setBikes(json)
    }
    run()
  }

  const handleGearWidgetSubmit = ({name, pk, distance, movingTime, bikeId, track}: GearWidgetSubmitParams) => {
    const run = async() => {
      await addOrChangeGear(name, pk, distance, movingTime, bikeId, track)
      getGear()
    }
    run()
  }

  const handleGearWidgetDelete = (gearPk: number) => {
    const run = async() => {
      await deleteGear(gearPk)
      getGear()
    }
    run()
  }

  const handleUnitChange = (field: string, value: string) => {
    const run = async() => {
      await changeAthlete(field, value)
      getGear()
    }
    run()
  }

  const gearWidgets = gear.map(g => {
    return <GearWidget
              key={g.pk}
              gear={g}
              bikes={bikes}
              onSubmit={handleGearWidgetSubmit}
              onDelete={handleGearWidgetDelete}
            />
  })

  React.useEffect(getAuthorizationStatus, [])
  React.useEffect(() => {
    if (authorized) {
      getGear()
      refreshAthBikes()
    }
  }, [authorized])

  return (
    <div>
      {authorized
        ? 
          <div id="main-page">
            <div id="top-bar">
              <UnitSwitch
                selectedUnits={
                  gear.length !== 0
                    ? { distance: gear[0].athlete.distance_unit, time: gear[0].athlete.time_unit}
                    : { distance: 'kilometer', time: 'hour'}
                }
                onChange={handleUnitChange}
              />
            </div>
            <div className="add-gear-widget">
              <AddGearWidget
                onSubmit={handleGearWidgetSubmit}
              />
            </div>
            <div className="gear-widgets">
              {gearWidgets}
            </div>
            <div>DASHBOARDS HERE</div>
          </div>
        : <button onClick={() => window.location.href=authorizeUrl}>Authorize</button>
      }
    </div>
    
  );
}

const container = document.getElementById('app')
ReactDOM.render(<App />, container)

export default App;
