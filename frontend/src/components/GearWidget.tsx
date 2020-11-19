import React from 'react'
import { Gear, Bike, toggleGearTracking } from '../api'
import './css/GearWidget.css'
import {addOrChangeGear} from '../api'
import MultiSelect from './MultiSelect'
import DurationInput from './DurationInput'
import { metersTo, secondsTo } from '../helpers/unitConverters'

interface GearWidgetProps {
    key: number,
    gear?: Gear,
    bikes: Bike[],
    onSubmit: any,
    onDelete: any,
}

export const GearWidget = ({gear, bikes, onSubmit, onDelete}: GearWidgetProps) => {

    const [name, setName] = React.useState<string>()
    const [distance, setDistance] = React.useState<number>()
    const [hours, setHours] = React.useState<number>()
    const [confirmDelete, setConfirmDelete] = React.useState<boolean>()

    React.useEffect(() => {
        setName(gear.name)
        setDistance(gear.converted_distance)
        setHours(gear.converted_time)
    }, [gear])

    const handleSubmit = (e: any) => {
        e.preventDefault()
       // if (name) {
            e.target.elements[0].focus()
            e.target.elements[0].blur()

            onSubmit({name: name, pk: gear.pk, distance: distance, movingTime: hours})
            //onSubmit()
      //  }
    }

    const bikeOptions = bikes.map(bike => {
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
                    <label>Distance: </label>
                    <input
                        type="number" 
                        min="0"
                        step="0.01"
                        className="input-masked"
                        value={distance}
                        onChange={(e: any) => setDistance(e.target.value)}
                    />
                </div>
                <div className="form-input-container">
                    <label>Time: </label>
                    <input
                        type="number" 
                        min="0"
                        className="input-masked"
                        value={hours}
                        onChange={(e: any) => setHours(e.target.value)}
                    />
                </div>
                <div className="form-input-container">
                    <label>Duration: </label>
                    <input 
                        type="text" 
                        className="input-masked"
                        value={gear.duration}
                        onChange={(e: any) => {}}   
                    />
                </div>
                <div className="form-input-container">
                    <label>Track: </label>
                    <input
                        type="checkbox"
                        checked={gear.is_tracked}
                        onChange={(e: any) => {
                            onSubmit({name: name, pk: gear.pk, distance: distance, track: !gear.is_tracked})
                        }}
                    />
                </div>
                <MultiSelect
                    options={bikeOptions}
                />                  
                {confirmDelete
                    ?
                        <div className="gear-widget-confirm-delete">
                            <div>Really?</div>
                            <button type="button" onClick={() => setConfirmDelete(false)}>No</button>
                            <button type="button" onClick={() => onDelete(gear.pk)}>Yes</button>              
                        </div>
                    :
                        <button 
                            className="gear-widget-delete-button"
                            type="button"
                            onClick={() => setConfirmDelete(true)}
                        >Delete</button>
                }    
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
        setName('')
    }

    const handleChange = (e: any) => setName(e.target.value)

    return (
        <form onSubmit={handleSubmit}>
            <input 
                value={name}
                type="text"
                placeholder="New gear name?"
                onChange={(e: any) => handleChange(e)}
            />
        </form>
    )
}