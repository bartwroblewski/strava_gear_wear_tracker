import React from 'react';
import ReactDOM from 'react-dom'
import './components/css/App.css'
import Test from './components/Test'
import { GearWidget } from './components/GearWidget'
import DistanceSwitch from './components/DistanceSwitch'
import Modal from './components/Modal'
import GearForm from './components/GearForm'
import DeleteGearForm from './components/DeleteGearForm'
import * as urls from './urls'

import { 
  Athlete, Gear, GearBike, 
  athleteCrud, gearCrud,
  getAuthStatus, logout
} from './api'

function App() {

  const [authorized, setAuthorized] = React.useState<number>()
  const [athlete, setAthlete] = React.useState<Athlete>()
  const [selectedGear, setSelectedGear] = React.useState<Gear>()
  const [bikes, setBikes] = React.useState<GearBike[]>([])
  const [action, setAction] = React.useState<string>('')

  const getAuthorizationStatus = () => {
    const run = async() => {
      const json = await getAuthStatus()
      console.log('Authorized?: ', json)
      setAuthorized(json)
    }
    run()
  }

  const getAthlete = () => {
    const run = async() => {
      const json = await athleteCrud.retrieve(authorized)     
      console.log('Athlete: ', json)
      setAthlete(json)
      console.log('Athlete bikes DRF ', json.bikes)
      setBikes(json.bikes)
    }
    run()
  }

  const handleAthleteChange = (athlete: Athlete) => {
    const run = async() => {
      await athleteCrud.update(athlete)
      getAthlete()
    }
    run()
  }

  const handleGearFormSubmit = (gear: Gear) => {
    const run = async() => {
      const action = gear.pk ? 'update' : 'create'
      await gearCrud[action](gear)
      getAthlete()
      setAction('')
    }
    run()
  }

  const handleDeleteGearFormSubmit = () => {
    const run = async() => {
      await gearCrud.del(selectedGear.pk)
      getAthlete()
      setAction('')
    }
    run() 
  }

  const handleLogout = async() => {
    await logout()
    getAuthorizationStatus()
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

  const addGearButton = (
    <button 
      className="add-gear-button"
      type="button"
      onClick={handleGearWidgetClick}>
      Add gear
    </button>
  )

  const distanceSwitch = (
    <DistanceSwitch
      selectedUnit={athlete?.distance_unit}
      onChange={(newUnit: string) => handleAthleteChange({...athlete, ...{distance_unit: newUnit}})}
    />
  )

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
      onCancel={hideModal}
    />
  )

/*   type ModalState = "none" | "gear_edit" | "gear_delete"

  const [modalState, setModalState] = React.useState<ModalState>("none")
 */

  /*  const getDisplayForm = () => { switch (modalState) {
    case "gear_edit": return gearForm
    case "delete": return deleteGearForm
    default: return null
  } */

  const actionMap = {
    'edit/add': gearForm,
    'delete': deleteGearForm,
  }

   const modal = action
     ? <Modal
         hide={hideModal}
         contents={actionMap[action]}        
       />
     : null

  const authorizeButton = 
    <img 
      id="authorize-button"
      src={urls.stravaButtonUrl}
      onClick={() => window.location.href=urls.authorizeUrl}
    />

  const log_out = athlete 
    ? <div id="logout" onClick={handleLogout}>Logout ({athlete.firstname} {athlete.lastname})</div>
    : null

  React.useEffect(getAuthorizationStatus, [])
  React.useEffect(() => {
    if (authorized) {
      getAthlete()
    }
  }, [authorized])

  return (
    authorized
        ? <div id="main-page">
            {modal}
            <div id="top-bar">
              <div id="app-name">
                GEAR TRACKER
              </div>
              {log_out}
            </div>
            <div id="button-bar">
              {addGearButton}
              {distanceSwitch}
            </div>
            {gearWidgets}    
          </div>
        : <div>
            {authorizeButton}
          </div>
  )
}

const container = document.getElementById('app')
ReactDOM.render(<App />, container)

export default App;
