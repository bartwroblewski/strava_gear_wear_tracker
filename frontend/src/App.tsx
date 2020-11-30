import React from 'react';
import ReactDOM from 'react-dom'
import { authorizeUrl } from './urls'
import './components/css/App.css'
import Test from './components/Test'
import { GearWidget } from './components/GearWidget'
import DistanceSwitch from './components/DistanceSwitch'
import Modal from './components/Modal'
import GearForm from './components/GearForm'

import { 
  fetchAuthorizationStatus,  
  fetchAthlete,
  refreshAthleteBikes,
  Athlete,
  Gear, 
  Bike, 
  deleteGear, 
  addOrChangeGear,
  changeAthlete,
} from './api'

function App() {

  const [authorized, setAuthorized] = React.useState<boolean>()
  const [athlete, setAthlete] = React.useState<Athlete>()
  const [selectedGear, setSelectedGear] = React.useState<Gear>()
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

  const getAthlete = () => {
    const run = async() => {
      const json = await fetchAthlete()     
      console.log('Athlete: ', json[0])
      setAthlete(json[0])
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

  const handleAthleteChange = (field: string, value: string) => {
    const run = async() => {
      await changeAthlete(field, value)
      getAthlete()
    }
    run()
  }

  const handleGearFormSubmit = (params) => {
    const run = async() => {
      await addOrChangeGear(...params)
      getAthlete()
      toggleGearModal()
    }
    run()
  }

  const handleGearWidgetClick = (pk: number) => {
    setSelectedGear(athlete.gear.filter(x => x.pk === pk)[0])
    toggleGearModal()
  }

  const handleGearWidgetDelete = (gearPk: number) => {
    const run = async() => {
      await deleteGear(gearPk)
      getAthlete()
    }
    run()
  }

  const toggleGearModal = () => setShowGearModal(prev => !prev)

  const gearWidgets = athlete?.gear.map(g => {
    return <GearWidget
              key={g.pk}
              gear={g}
              distanceUnit={athlete.distance_unit}
              onClick={handleGearWidgetClick}
              onDelete={handleGearWidgetDelete}
            />
  }) || []

  React.useEffect(getAuthorizationStatus, [])
  React.useEffect(() => {
    if (authorized) {
      getAthlete()
      refreshAthBikes()
    }
  }, [authorized])

  return (
    <div>
      {authorized
        ? 
          <div id="main-page">
            <div id="top-bar">
              <button className="add-gear-button"type="button" onClick={() => {
                setSelectedGear(null)
                toggleGearModal()
              }}>Add gear</button>
              <DistanceSwitch
                selectedUnit={athlete?.distance_unit || null}
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
                        gear={selectedGear || null}
                        athleteDistanceUnit={athlete.distance_unit}
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
