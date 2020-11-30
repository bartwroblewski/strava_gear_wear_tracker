import React from 'react';
import ReactDOM from 'react-dom'
import { authorizeUrl } from './urls'
import './components/css/App.css'
import Test from './components/Test'
import { GearWidget } from './components/GearWidget'
import DistanceSwitch from './components/DistanceSwitch'
import Modal from './components/Modal'
import GearForm from './components/GearForm'
import DeleteGearForm from './components/DeleteGearForm'

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
  const [action, setAction] = React.useState<string>('')

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
      setAction('')
    }
    run()
  }

  const handleDeleteGearFormSubmit = () => {
    const run = async() => {
      await deleteGear(selectedGear.pk)
      getAthlete()
    }
    run() 
    setAction('')
  }

  const selectGear = (pk?: number) => {
    const gear = athlete.gear.filter(x => x.pk === pk)[0]
    setSelectedGear(gear)
  }

  const handleGearWidgetClick = (pk?: number) => {
    selectGear(pk)
    setAction('edit/add')
  }

  const handleGearWidgetDelete = (pk: number) => {
    selectGear(pk)
    setAction('delete')
  }

  const hideModal = () => setAction('')

  const gearWidgets = athlete?.gear.map(g => {
    return <GearWidget
              key={g.pk}
              gear={g}
              distanceUnit={athlete.distance_unit}
              onClick={handleGearWidgetClick}
              onDelete={handleGearWidgetDelete}
            />
  }) || []

  const gearForm = (
    <GearForm
      gear={selectedGear}
      athleteDistanceUnit={athlete?.distance_unit}
      bikes={bikes}
      onSubmit={handleGearFormSubmit}
    />
  )
  const deleteGearForm = (
    <DeleteGearForm
      onSubmit={handleDeleteGearFormSubmit}
    />
  )

  React.useEffect(getAuthorizationStatus, [])
  React.useEffect(() => {
    if (authorized) {
      getAthlete()
      refreshAthBikes()
    }
  }, [authorized])

  const actionMap = {
    'edit/add': gearForm,
    'delete': deleteGearForm,
  }

  return (
    <div>
      {authorized
        ? 
          <div id="main-page">
            <div id="top-bar">
              <button className="add-gear-button"type="button" onClick={handleGearWidgetClick}>Add gear</button>
              <DistanceSwitch
                selectedUnit={athlete?.distance_unit || null}
                onChange={handleAthleteChange}
              />
            </div>
            <div className="gear-widgets">
              {gearWidgets}   
            </div>
            <div>
              {action 
                ? <Modal
                    hide={hideModal}
                    contents={actionMap[action]}        
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
