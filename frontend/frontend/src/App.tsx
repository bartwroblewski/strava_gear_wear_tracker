import React from 'react';
import GearSelect from './components/GearSelect'
import GearWidget from './components/GearWidget'
import AddGearWidget from './components/AddGearWidget'
import MultiSelect from './components/MultiSelect'
import { authorizeUrl } from './urls'
import Modal from './components/Modals'
import Form from './components/Forms'

import { fetchAuthorizationStatus, fetchUserGear, refreshAthleteBikes, Gear, Bike, toggleGearTracking, deleteGear, addGear } from './api'

function App() {

  const [gear, setGear] = React.useState<Gear[]>([])
  const [authorized, setAuthorized] = React.useState<boolean>()
  const [bikes, setBikes] = React.useState<Bike[]>([])
  const [addGearModalVisible, setAddGearModalVisible] = React.useState<boolean>(false)

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

  const handleAddGearFormSubmit = (gearName: string, gearMileage: number, bikeIds: string[]) => {
    const run = async() => {
      await addGear(gearName, bikeIds, gearMileage, true)
      getGear()
    }
    run()
  }


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
        ? <div>
            {gearWidgets}
            <button onClick={(e: any) => setAddGearModalVisible(true)}>Add gear</button>
          </div>
        : <button onClick={() => window.location.href=authorizeUrl}>Authorize</button>
      }
      {addGearModalVisible
        ? <Modal 
            toggleModal={() => alert('toggle')}
            content={
              <Form
                bikes={bikes}
                onSubmit={handleAddGearFormSubmit}
              />}
          />
        : null
      }
    </div>
  );
}

export default App;
