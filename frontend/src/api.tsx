import * as urls from './urls'

type Promised<T> = (...args: any[]) => Promise<T>

export interface GearBike {
    ref_id: string,
    name: string,
    athlete: number,
}

export interface GearDuration {
    string?: string,
    days: number,
    hours: number,
    minutes: number,
    seconds: number,
}

interface Milestone {
    target: number,
    remaining: number,
    remaining_converted: string | number
}

interface Milestones {
    moving_time: Milestone,
    distance: Milestone,
}

export interface Gear {
    pk: number,
    name: string,
    distance: number,
    distance_in_athlete_unit: number,
    distance_milestone: number,
    distance_milestone_in_athlete_unit: number,
    distance_remaining_to_milestone: number,
    moving_time: number,
    moving_time_milestone: number,
    moving_time_remaining_to_milestone: string,
    duration: GearDuration;
    is_tracked: boolean,
    athlete: Athlete,
    bikes: GearBike[],
   
    milestones: Milestones,
}

export interface Athlete {
    pk: number,
    firstname: string,
    lastname: string,
    distance_unit: string,
    time_unit: string,
    gear: Gear[]

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

const fetchAthlete: Promised<Athlete> = () => fetchJsonWithErrorHandling(urls.athleteUrl)

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

const addOrChangeGear: Promised<any> = async(pk, name, distance, distanceMilestone, duration, track, bikeIds) => {
    let url = urls.addOrChangeGearUrl +
    `?pk=${pk}` +
    `&name=${name}` +
    `&distance=${distance}` +
    `&distance_milestone=${distanceMilestone}` +
    `&days=${duration.days}` +
    `&hours=${duration.hours}` +
    `&minutes=${duration.minutes}` +
    `&seconds=${duration.seconds}` +
    `&track=${track}` +
    `&duration=${[duration.days, duration.hours, duration.minutes, duration.seconds]}`

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
    refreshAthleteBikes, 
    toggleGearTracking, 
    deleteGear, 
    addOrChangeGear
}