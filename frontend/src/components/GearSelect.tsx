import React from 'react'

interface GearSelectProps {
    options: string[],
}

const GearSelect = ({options}: GearSelectProps) => {
    return (
        <select>
            {options.map(o => <option>{o}</option>)}
        </select>
    )
}

export default GearSelect