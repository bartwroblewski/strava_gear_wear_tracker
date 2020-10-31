import React from 'react';
import ReactDOM from 'react-dom'
import GearSelect from './components/GearSelect'
import GearWidget from './components/GearWidget'
import MultiSelect from './components/MultiSelect'
import { authorizeUrl } from './urls'
import Modal from './components/Modals'
import Form from './components/Forms'
import './components/css/App.css'
import Test from './components/Test'
import { EditableGearWidget } from './components/GearWidget'

import { fetchAuthorizationStatus, fetchUserGear, refreshAthleteBikes, Gear, Bike, toggleGearTracking, deleteGear, addGear } from './api'

function App() {

  const [gear, setGear] = React.useState<Gear[]>([])
  const [authorized, setAuthorized] = React.useState<boolean>()
  const [bikes, setBikes] = React.useState<Bike[]>([])
  const [addGearWidgetVisible, setaddGearWidgetVisible] = React.useState<boolean>(false)

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

  const toggleAddGearModal = () => setaddGearWidgetVisible(prev => !prev)

  const handleAddGearFormSubmit = (gearName: string, gearMileage: number, bikeIds: string[]) => {
    const run = async() => {
      await addGear(gearName, bikeIds, gearMileage, true)
      getGear()
      toggleAddGearModal()
    }
    run()
  }

  const handleAddGearFormCancel = () => toggleAddGearModal()

  const gearWidgets = gear.map(g => {
    return <GearWidget 
              gearName={g.name} 
              gearMileage={g.mileage}
              gearBikes={g.bikes}
              toggleGearTracking={toggleGearTracking} 
              is_tracked={g.is_tracked}
              getGear={getGear}
              deleteGear={deleteGear}
            />
  })

  const editableGearWidgets = gear.map(g => {
    return <EditableGearWidget 
              gearName={g.name} 
              gearMileage={g.mileage}
              gearBikes={g.bikes}
              bikes={bikes}
             /*  toggleGearTracking={toggleGearTracking} 
              is_tracked={g.is_tracked}
              getGear={getGear}
              deleteGear={deleteGear} */
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
        ? <div id="main-page">
            <div className="gear-widgets">
              {/* {gearWidgets} */}
              {editableGearWidgets}
              {addGearWidgetVisible
                ? <EditableGearWidget bikes={bikes} />
                : null
              }
            </div>
            <button 
              id="add-gear-button"
              onClick={(e: any) => setaddGearWidgetVisible(true)}>Add gear
            </button>
          </div>
        : <button onClick={() => window.location.href=authorizeUrl}>Authorize</button>
      }
      
    </div>
  );
}

const container = document.getElementById('app')
ReactDOM.render(<App />, container)

export default App;
