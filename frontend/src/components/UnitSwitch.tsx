import React from 'react'
import './css/UnitSwitch.css'
import capitalize from '../helpers/capitalize'

interface SwitchProps {
    label?: string,
    options?: string[],
    selectedOption?: string,
    units?: any,
    setUnits?: any,
    onClick?: any,
}

const Switch = ({label, options, selectedOption, onClick}: SwitchProps) => {

    const handleClick = (option: string) => {
        onClick(option)
    }

    const opts = options.map(o => {
        const className = selectedOption === o ? "switch-option-selected" : "switch-option"
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

const DistanceSwitch = ({units, setUnits}: SwitchProps) => {
    return (
        <Switch 
            label="distance" 
            options={["kilometers", "miles"]}
            selectedOption={units.distance}
            onClick={(unit: string) => {
                setUnits(prev => ({...prev, ...{distance: unit}}))
            }}
        />
    )
}

const TimeSwitch = ({units, setUnits}: SwitchProps) => {
    return (
        <Switch 
            label="time"
            options={['hours', 'days']}
            selectedOption={units.time}
            onClick={(unit: string) => {
                setUnits(prev => ({...prev, ...{time: unit}}))
            }}
        />
    )
}

const UnitSwitch = ({units, setUnits}: SwitchProps) => {
    return (
        <div id="unit-switch">
            <DistanceSwitch units={units} setUnits={setUnits} />
            <TimeSwitch units={units} setUnits={setUnits} />
        </div>
    )
}
export default UnitSwitch