import React from 'react'
import { Gear, Bike, toggleGearTracking } from '../api'
import './css/GearWidget.css'
import {addOrChangeGear} from '../api'
import MultiSelect from './MultiSelect'

interface GearWidgetProps {
    gear?: Gear,
    bikes: Bike[],
    onSubmit: any,
    onDelete: any,
}

export const GearWidget = ({gear, bikes, onSubmit, onDelete}: GearWidgetProps) => {

    const [name, setName] = React.useState<string>()
    const [mileage, setMileage] = React.useState<number>()
    const [confirmDelete, setConfirmDelete] = React.useState<boolean>(false)

    React.useEffect(() => {
        setName(gear.name)
        setMileage(gear.mileage)
    }, [gear])

    const handleSubmit = (e: any) => {
        e.preventDefault()
       // if (name) {
            e.target.elements[0].focus()
            e.target.elements[0].blur()

            onSubmit({name: name, pk: gear.pk, mileage: mileage})
            //onSubmit()
      //  }
    }

    const bikeOptions = bikes.map(bike => {
        const gearBikeNames = gear.bikes.map(b => b.name)
        const className = gearBikeNames.includes(bike.name) ? 'selected-option' : null
        return <option className={className} value={bike.id}>{bike.name}</option>
    })

    const opts = bikes.map(bike => {
        return (
          <div className={"multi-select-option"}>
            <input 
                type="checkbox"
                checked={gear.bikes.map(x => x.name).includes(bike.name)}
                onChange={e => onSubmit({name: gear.name, bikeId: bike.id, pk: gear.pk})}
            />
            <div>{bike.name}</div>
         </div>
        )
      })

    return (
        <div className="gear-widget">
            <form onSubmit={(e: any) => handleSubmit(e)}>
                <div className="form-input-container">
                    <label>Name: </label>
                    <input 
                        type="text" 
                        className="input-masked"
                        value={name}
                        required
                        onChange={(e: any) => setName(e.target.value)}   
                        placeholder="Please fill in this field"
                    />
                </div>
                <div className="form-input-container">
                    <label>Mileage: </label>
                    <input
                        type="number" 
                        min="0"
                        className="input-masked"
                        value={mileage}
                        onChange={(e: any) => setMileage(e.target.value)}
                    />
                </div>
                <div className="form-input-container">
                    <label>Track: </label>
                    <input
                        type="checkbox"
                        checked={gear.is_tracked}
                        onChange={(e: any) => {
                            onSubmit({name: name, pk: gear.pk, mileage: mileage, track: !gear.is_tracked})
                        }}
                    />
                </div>
                <div className="form-input-container">
                    <label>Bikes: </label>
                    <select 
                        multiple
                        onChange={(e: any) => {
                            onSubmit({name: name, bikeId: e.target.value, pk: gear.pk})
                        }}
                    >
                        {bikeOptions}
                    </select>
                </div>
                <MultiSelect
                    options={opts}
                />              
                <div className="confirm-delete">
                    {confirmDelete
                        ?
                            <div>Really?
                                <button type="button" onClick={() => onDelete(gear.pk)}>Yes</button>
                                <button type="button" onClick={() => setConfirmDelete(false)}>No</button>
                            </div>
                        :
                            <button type="button" onClick={() => setConfirmDelete(true)}>Delete</button>
                    }    
                </div>
                <button type="submit" hidden>Submit</button>
            </form>
        </div>
    )
}         

interface AddGearWidgetProps {
    onSubmit: any,
}

export const AddGearWidget = ({onSubmit}: AddGearWidgetProps) => {

    const [name, setName] = React.useState<string>()

    const handleSubmit = (e: any) => {
        e.preventDefault()
        //addOrChangeGear(name)
        onSubmit({name: name})
    }

    const handleChange = (e: any) => setName(e.target.value)

    return (
        <form onSubmit={handleSubmit}>
            <input 
                type="text"
                placeholder="New gear name?"
                onChange={(e: any) => handleChange(e)}
            />
        </form>
    )
}