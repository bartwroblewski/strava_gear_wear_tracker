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

export const toHHMMSS = (seconds: number): string => {
    const d = toDuration(seconds)
    const hhmmss = `${d.d} days, ${d.h}:${d.m}:${d.s}`
    return hhmmss
}

const meterFactors = {
    km: 1000,
    mi: 1609.34,
}

export const metersToUnit = (meters: number, unit: string): string =>
   meters / meterFactors[unit] + ' ' + unit
