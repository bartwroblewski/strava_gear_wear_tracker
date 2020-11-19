import React from 'react'
import './css/UnitSwitch.css'
import capitalize from '../helpers/capitalize'

interface SwitchProps {
    label: string,
    options: string[],
    selectedUnit: string,
    onChange: any;
}

const Switch = ({label, options, selectedUnit, onChange}: SwitchProps) => {
    console.log(selectedUnit)

    const handleClick = (option: string) => {
        onChange(`${label}_unit`, option)

    }

    const opts = options.map(o => {
        const className = selectedUnit === o ? "switch-option-selected" : "switch-option"
        return <div onClick={() => handleClick(o)} className={className}>{o}</div>
    })

    return (
        <div className="switch">
            <div className="switch-label">{`${capitalize(label)} in:`}</div>
            <div className="switch-options">
                {opts}
            </div>
        </div>
    )
}

const DistanceSwitch = ({selectedUnit, onChange}: {selectedUnit: string, onChange: any}) => {
    return (
        <Switch 
            label="distance" 
            options={["kilometer", "mile"]}
            selectedUnit={selectedUnit}
            onChange={onChange}
        />
    )
}

const TimeSwitch = ({selectedUnit, onChange}: {selectedUnit: string, onChange: any}) => {
    return (
        <Switch 
            label="time"
            options={['hour', 'day']}
            selectedUnit={selectedUnit}
            onChange={onChange}
        />
    )
}
interface UnitSwitchProps {
    selectedUnits: {distance: string, time: string},
    onChange: any,
}

const UnitSwitch = ({selectedUnits, onChange}: UnitSwitchProps) => {
    return (
        <div id="unit-switch">
            <DistanceSwitch selectedUnit={selectedUnits.distance} onChange={onChange} />
            <TimeSwitch selectedUnit={selectedUnits.time} onChange={onChange} />
        </div>
    )
}
export default UnitSwitch