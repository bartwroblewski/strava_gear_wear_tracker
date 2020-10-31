import * as urls from './urls'

type Promised<T> = (...args: any[]) => Promise<T>

export interface GearBike {
    ref_id: string,
    name: string,
    athlete: number,
}

export interface Gear {
    name: string,
    mileage: number,
    is_tracked: boolean,
    athlete: string,
    bikes: GearBike[],
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

const deleteGear: (arg: string) => Promise<any> = async(gearName: string) => {
    const response = await fetch(urls.deleteGearUrl + `/${gearName}`)
    const text = await response.text()
    return text
}

const addGear: Promised<any>  = async(gearName: string, bikeIds: string[],  mileage: number, track: boolean) => {
    let url = urls.addGearUrl +
        `?gear_name=${gearName}` +
        `&bike_ids=${bikeIds}` + 
        `&mileage=${mileage}` +
        `&track=${track}`
    const response = await fetch(url)
    const text = await response.text()
    if (response.ok) {
        return text
    }
    alert(text)
}

export { fetchAuthorizationStatus, fetchUserGear, refreshAthleteBikes, toggleGearTracking, deleteGear, addGear }