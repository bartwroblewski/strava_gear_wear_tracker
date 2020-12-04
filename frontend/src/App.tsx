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
  Athlete,
  Gear, 
  GearBike, 
  deleteGear, 
  addOrChangeGear,
  //changeAthlete,
} from './api'

import { getAthlete as getAth, changeAthlete, deleteGear as delGear, changeGear,  Resource } from './testapi'

function App() {

  const [authorized, setAuthorized] = React.useState<{authorized: boolean, athlete_pk: number}>()
  const [athlete, setAthlete] = React.useState<Athlete>()
  const [selectedGear, setSelectedGear] = React.useState<Gear>()
  const [bikes, setBikes] = React.useState<GearBike[]>([])
  const [action, setAction] = React.useState<string>('')

  const getAuthorizationStatus = () => {
    const run = async() => {
      const json = await fetchAuthorizationStatus()
      console.log('Authorized?: ', json)
      setAuthorized(json)
    }
    run()
  }

  const getAthlete = () => {
    const run = async() => {
      const json = await getAth(authorized.athlete_pk)     
      console.log('Athlete: ', json)
      setAthlete(json)
      console.log('Athlete bikes DRF ', json.bikes)
      setBikes(json.bikes)
    }
    run()
  }

  const handleAthleteChange = (newAthlete: Resource) => {
    console.log(newAthlete)
    const run = async() => {
      await changeAthlete(newAthlete)
      getAthlete()
    }
    run()
  }

  const handleGearFormSubmit = (params) => {
    const run = async() => {
      //await addOrChangeGear(...params)
      await changeGear(params)
      getAthlete()
      setAction('')
    }
    run()
  }

  const handleDeleteGearFormSubmit = () => {
    const run = async() => {
      await delGear(selectedGear.pk)
      getAthlete()
      setAction('')
    }
    run() 
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
    <button 
      onClick={() => window.location.href=authorizeUrl}>
      Authorize
    </button>

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
              {addGearButton}
              {distanceSwitch}
            </div>
            {gearWidgets}    
            <Test />
          </div>
        : authorizeButton
      
  )
}

const container = document.getElementById('app')
ReactDOM.render(<App />, container)

export default App;
