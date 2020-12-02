import * as urls from './urls'

type Promised<T> = (...args: any[]) => Promise<T>

export interface GearBike {
    ref_id: string,
    name: string,
}

export interface Gear {
    pk: number,
    name: string,
    distance: number,
    distance_milestone: number,
    moving_time: number,
    moving_time_milestone: number,
    is_tracked: boolean,
    bikes: GearBike[],
}

export interface Athlete {
    pk: number,
    firstname: string,
    lastname: string,
    distance_unit: string,
    time_unit: string,
    gear: Gear[],
}

interface ResponseError {
    type: string,
    message: string,
    data: string,
    code: string,
}

const ErrorEnabledFetch: Promised<any> = async(fetchFunc: () => {}) => {
    try {
        const result = await fetchFunc()
        return result
    } catch(e)  {
        return handleResponseError(e)
    }
}

const handleResponseError = (e: ResponseError) => {
    alert(e.message)
    return new Promise((resolve, reject) => resolve([]))
}

const fetchJson: Promised<any> = async(url: string) => {
    const response = await fetch(url)
    const json = await response.json()
    if (response.ok) {
        return json
    }
    const responseError = {
        type: json.type || '',
        message: json.message || json.detail || '',
        data: json.data || '',
        code: json.code || '',
    }

    let resError = new Error()
    resError = { ...resError, ...responseError }
    
    throw(resError)
}

const fetchJsonWithErrorHandling = async(url:string) => ErrorEnabledFetch(() => fetchJson(url))

const fetchAuthorizationStatus: Promised<{authorized: boolean}> = () => fetchJsonWithErrorHandling(urls.authorizedUrl)

const fetchAthlete: Promised<Athlete> = () => fetchJsonWithErrorHandling(urls.athleteUrl)

const deleteGear: Promised<any> = async(gearPk: number) => {
    const response = await fetch(urls.deleteGearUrl + `/${gearPk}`)
    const text = await response.text()
    return text
}

const addOrChangeGear: Promised<any> = async(pk, name, distance, distanceMilestone, time, timeMilestone, track, bikeIds) => {
    let url = urls.addOrChangeGearUrl +
    `?pk=${pk}` +
    `&name=${name}` +
    `&distance=${distance}` +
    `&distance_milestone=${distanceMilestone}` +
    `&time=${time}` +
    `&time_milestone=${timeMilestone}` +
    `&track=${track}` 
    
    if (bikeIds.length) {
        url = url + `&bike_ids=${bikeIds.join()}`
    }

    const response = await fetch(url)
    const text = await response.text()
    
    if (response.ok) {
        return text
    }
    alert(text)
}

export const changeAthlete: Promised<any> = async(field: string, value: string) => {
    let url = urls.changeAthleteUrl + `?field=${field}&value=${value}`
    const response = await fetch(url)
    const text = await response.text()
    return text
}

export { 
    fetchAuthorizationStatus,
    fetchAthlete,
    deleteGear, 
    addOrChangeGear
}