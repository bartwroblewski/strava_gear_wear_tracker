export const metersTo = (meters: number, targetUnit: string): number => {
    switch (targetUnit) {
        case 'kilometers':
            return meters / 1000         
        case 'miles':
            return meters / 1609
    }
}

export const secondsTo = (seconds: number, targetUnit: string): number => {
    switch (targetUnit) {
        case 'hours':
            return seconds / 3600
        case 'days':
            return seconds / 86400
    }
}
