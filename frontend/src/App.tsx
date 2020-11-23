import React from 'react';
import ReactDOM from 'react-dom'
import { authorizeUrl } from './urls'
import './components/css/App.css'
import Test from './components/Test'
import { GearWidget, AddGearWidget } from './components/GearWidget'
import DistanceSwitch from './components/DistanceSwitch'
import Modal from './components/Modal'
import GearForm from './components/GearForm'

import { 
  fetchAuthorizationStatus, 
  fetchUserGear, 
  fetchAthlete,
  refreshAthleteBikes,
  Athlete,
  Gear, 
  Bike, 
  toggleGearTracking,
  deleteGear, 
  addGear, 
  addOrChangeGear,
  changeAthlete,
} from './api'

function App() {

  const [authorized, setAuthorized] = React.useState<boolean>()
  const [gear, setGear] = React.useState<Gear[]>([])
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
  
  const getGear = () => {
    const run = async() => {
      const json = await fetchUserGear()     
      console.log('User gear: ', json)
      setGear(json)
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
      getGear()
    }
    run()
  }

  const handleGearFormSubmit = (params) => {
    const run = async() => {
      await addOrChangeGear(...params)
      getGear()
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
      getGear()
    }
    run()
  }

  const toggleGearModal = () => setShowGearModal(prev => !prev)

  const gearWidgets = athlete ? athlete.gear.map(g => {
    return <GearWidget
              key={g.pk}
              gear={g}
              distanceUnit={athlete.distance_unit}
              onClick={handleGearWidgetClick}
            />
  }) : []

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
              <button type="button" onClick={() => {
                setSelectedGear(null)
                toggleGearModal()
              }}>Add gear</button>
              <DistanceSwitch
                selectedUnit={athlete ? athlete.distance_unit : null}
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
                        defaults={
                          selectedGear
                            ? {
                              pk: selectedGear.pk,
                              name: selectedGear.name,
                              distance_unit: athlete.distance_unit,
                              distance_in_athlete_unit: selectedGear.distance_in_athlete_unit,    
                              duration: {
                                days: selectedGear.duration.days,
                                hours: selectedGear.duration.hours,
                                minutes: selectedGear.duration.minutes,
                                seconds: selectedGear.duration.seconds,
                              },
                              track: selectedGear.is_tracked,
                              bikeIds: selectedGear.bikes.map(x => x.ref_id)
                            }                             
                            : {
                              pk: 0,
                              name: '',
                              distance_unit: athlete.distance_unit,
                              distance_in_athlete_unit: 0,   
                              duration: {
                                days: 0,
                                hours: 0,
                                minutes: 0,
                                seconds: 0,
                              },
                              track: true,
                              bikeIds: [],
                            }            
                        }
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
