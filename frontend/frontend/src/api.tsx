type Promised<T> = (...args: any[]) => Promise<T>

export interface Gear {
    name: string,
    mileage: number,
    is_tracked: boolean,
    athlete: string,
    bike: {
        ref_id: number,
        name: string,
        athlete: number,
    },
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

const domain: string = 'http://localhost:8000' // 'http://adc390d1a737.ngrok.io'//

const authorizedUrl: string = domain + '/get_authorization_status'
const fetchAuthorizationStatus: Promised<{authorized: boolean}> = () => fetchJsonWithErrorHandling(authorizedUrl)

const userGearUrl: string = domain + '/user_gear'
const fetchUserGear: Promised<Gear[]> = () => fetchJsonWithErrorHandling(userGearUrl)

const refreshBikesUrl: string = domain + '/refresh_athlete_bikes'
const refreshAthleteBikes: Promised<Bike[]> = () => fetchJsonWithErrorHandling(refreshBikesUrl)

const toggleGearTrackingUrl: string = domain + '/toggle_gear_tracking'
const toggleGearTracking: (arg: string) => Promise<any> = async(gearName: string) => {
    const response = await fetch(toggleGearTrackingUrl + `/${gearName}`)
    const text = await response.text()
    return text
}

const deleteGearUrl: string = domain + '/delete_gear'
const deleteGear: (arg: string) => Promise<any> = async(gearName: string) => {
    const response = await fetch(deleteGearUrl + `/${gearName}`)
    const text = await response.text()
    return text
}

let addGearUrl: string = domain + '/add_gear'
const addGear: Promised<any>  = async(gearName: string, mileage: number, track: boolean, success_callback: () => void) => {
    let url = addGearUrl + `?gear_name=${gearName}` + `&mileage=${mileage}` + `&track=${track}`
    const response = await fetch(url)
    const text = await response.text()
    if (response.ok) {
        success_callback()
        return text
    }
    alert(text)
    
}

export { fetchAuthorizationStatus, fetchUserGear, refreshAthleteBikes, toggleGearTracking, deleteGear, addGear }