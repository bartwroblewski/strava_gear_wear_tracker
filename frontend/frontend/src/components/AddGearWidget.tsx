import React from 'react'
import { getGeneratedNameForNode, isPropertySignature, textChangeRangeIsUnchanged } from 'typescript'
import AddGearButton from './AddGearButton'
import { addGear } from '../api'
import './css/AddGearWidget.css'

interface AddGearWidgetProps {
    getGear: () => void,
}

const AddGearWidget = ({getGear}: AddGearWidgetProps) => {
    return (
        <div>
            <div id="add-gear-widget-modal">
                <div>
                    Gear name: <input type="text"/>
                    Initial mileage: <input type="number"/>
                    Track: <input type="checkbox"/>
                </div>
                <div>
                    <button>OK</button>
                    <button>Cancel</button>
                </div>
            </div>
            <AddGearButton 
                addGear={addGear}
                getGear={getGear}
            />
        </div>
    )
}

export default AddGearWidget