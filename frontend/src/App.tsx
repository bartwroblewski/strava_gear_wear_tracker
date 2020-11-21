import React from 'react';
import ReactDOM from 'react-dom'
import { authorizeUrl } from './urls'
import './components/css/App.css'
import Test from './components/Test'
import { GearWidget, AddGearWidget } from './components/GearWidget'
import UnitSwitch from './components/UnitSwitch'
import Modal from './components/Modal'
import GearForm from './components/GearForm'

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
  const [selectedGearPk, setSelectedGearPk] = React.useState<number>()
  const [authorized, setAuthorized] = React.useState<boolean>()
  const [bikes, setBikes] = React.useState<Bike[]>([])
  const [showGearModal, setShowGearModal] = React.useState<boolean>()

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

  const handleGearFormSubmit = ({name, pk, distance, movingTime, bikeId, track}: GearWidgetSubmitParams) => {
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

  const handleAthleteChange = (field: string, value: string) => {
    const run = async() => {
      await changeAthlete(field, value)
      getGear()
    }
    run()
  }

  const toggleGearModal = () => setShowGearModal(prev => !prev)

  const gearWidgets = gear.map(g => {
    return <GearWidget
              key={g.pk}
              gear={g}
              onClick={(pk: number) => {
                setSelectedGearPk(pk)
                toggleGearModal()
              }}
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
              <div className="add-gear-widget">
                <AddGearWidget
                  onSubmit={handleGearFormSubmit}
                />
              </div>
              <UnitSwitch
                selectedUnits={{
                  distance: gear.length ? gear[0].athlete.distance_unit : null,
                  time: gear.length ? gear[0].athlete.time_unit : null
                }}
                onChange={handleAthleteChange}
              />
            </div>
            <div className="gear-widgets">
              {gearWidgets}
            </div>
            <div>
              {showGearModal
                ? <Modal
                    toggle={toggleGearModal}
                    contents={
                      <GearForm
                        gear={gear.filter(x => x.pk === selectedGearPk)[0]}
                        bikes={bikes}
                        onSubmit={handleGearFormSubmit}
                      />
                    }         
                  />
                : null
              }
            </div>
          </div>
        : <button onClick={() => window.location.href=authorizeUrl}>Authorize</button>
      }
    </div>
    
  );
}

const container = document.getElementById('app')
ReactDOM.render(<App />, container)

export default App;
