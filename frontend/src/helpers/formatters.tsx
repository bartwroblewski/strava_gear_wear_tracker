interface Duration {
    d: number,
    h: number,
    m: number,
    s: number,
}

export const toDuration = (seconds: number): Duration => {
    let s = seconds
    const d = Math.floor(s / (3600*24));
    s -= d*3600*24;
    const h = Math.floor(s / 3600);
    s -= h*3600;
    const m = Math.floor(s / 60);
    s -= m*60;
    return {d, h, m, s}
}

const pad = (int: number, size: number): string => {
    let numStr = int.toString()
    while (numStr.length < size) numStr = '0' + numStr
    return numStr
}

export const toHHMMSS = (seconds: number): string => {
    const { d, h, m, s } = toDuration(seconds)
    const dayString = d === 1 ? 'day' : 'days'
    const days = d ? d.toLocaleString() + ` ${dayString}, ` : ''
    const [hh, mm, ss] = [h, m, s].map(x => pad(x, 2))
    const hhmmss = `${days}${hh}:${mm}:${ss}`
    return hhmmss
}

export const timeFactors = {d: 86400, h: 3600, m: 60, s: 1}

export const metersIn = {
    km: 1000,
    mi: 1609.34,
}

const round = (value, decimals) => {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals)
}

export const metersToUnit = (meters: number, unit: string): number => 
    meters 
        ? round((meters / metersIn[unit]), 2)
        : 0

export const metersFromUnit = (distance: number, unit: string): number =>
    distance * metersIn[unit]

export const metersToUnitString = (meters: number, unit: string): string =>
   metersToUnit(meters, unit).toLocaleString() + ' ' + unit