import * as urls from './urls'

type Promised<T> = (...args: any[]) => Promise<T>

export interface GearBike {
    ref_id: string,
    name: string,
    athlete: number,
}

interface Athlete {
    pk: number,
    distance_unit: string,
    time_unit: string,
}

interface GearDuration {
    string: string,
    days: number,
    hours: number,
    minutes: number,
    seconds: number,
}

export interface Gear {
    pk: number,
    name: string,
    distance: number,
    moving_time: number,
    duration: GearDuration;
    is_tracked: boolean,
    athlete: Athlete,
    bikes: GearBike[],
    distance_in_athlete_unit: number,
    converted_time: number,
}

export interface Bike {
    id: string,
    primary: boolean,
    name: string,
    resource_state: number,
    distance: number,
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

const fetchUserGear: Promised<Gear[]> = () => fetchJsonWithErrorHandling(urls.userGearUrl)

const refreshAthleteBikes: Promised<Bike[]> = () => fetchJsonWithErrorHandling(urls.refreshBikesUrl)

const toggleGearTracking: (arg: string) => Promise<any> = async(gearName: string) => {
    const response = await fetch(urls.toggleGearTrackingUrl + `/${gearName}`)
    const text = await response.text()
    return text
}

const deleteGear: Promised<any> = async(gearPk: number) => {
    const response = await fetch(urls.deleteGearUrl + `/${gearPk}`)
    const text = await response.text()
    return text
}

const addGear: Promised<any>  = async(gearName: string, bikeIds: string[],  distance: number, track: boolean) => {
    let url = urls.addGearUrl +
        `?gear_name=${gearName}` +
        `&bike_ids=${bikeIds}` + 
        `&distance=${distance}` +
        `&track=${track}`
    const response = await fetch(url)
    const text = await response.text()
    if (response.ok) {
        return text
    }
    alert(text)
}

const addOrChangeGear: Promised<any> = async(
        gearName: string, 
        gearPk?: number,
        gearDistance?: number, 
        gearMovingTime?: number,
        bikeId?: string, 
        track?: boolean
    ) => {
        let url = urls.addOrChangeGear +`?name=${gearName}`
        if (gearPk) url = url + `&gear_pk=${gearPk}`
        if (gearDistance !== undefined) url = url +  `&distance=${gearDistance}`
        if (gearMovingTime !== undefined) url = url +  `&moving_time=${gearMovingTime}`
        if (bikeId) url = url +  `&bike_id=${bikeId}`
        if (track !== undefined) url = url + `&is_tracked=${track}`
            //`&track=${track}`
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

export { fetchAuthorizationStatus, fetchUserGear, refreshAthleteBikes, toggleGearTracking, deleteGear, addGear, addOrChangeGear }