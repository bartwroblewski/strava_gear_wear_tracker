export interface Resource {
    pk: number,
    //other optional here...
}

const domain: string =  'http://localhost:8000'//'http://f918bae6f5b0.ngrok.io'
const athleteUrl: string = domain + '/athlete'
const gearUrl: string = domain + '/gear'

const getResource = async(pk: number, url: string): Promise<Resource> => {
    const response = await fetch(url + '/' + pk)
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

const changeResource = async(payload: Resource, url: string) => {
    const URL = url + `/${payload.pk}`
    const response = await fetch(URL, {
        method: 'PUT',
        mode: 'same-origin',  // Do not send CSRF token to another domain.
        body: JSON.stringify(payload),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            'X-CSRFToken': getCookie('csrftoken'),
        },
    })
    const status = await response.status
    return status
}

const deleteResource = async(pk: number, url: string) => {
    const URL = url + '/' + pk
    const response = await fetch(URL, {
        method: 'DELETE',
        mode: 'same-origin',  // Do not send CSRF token to another domain.
        headers: {
            'X-CSRFToken': getCookie('csrftoken'),
        },
    })
    const status = await response.status
    return status
}

const createResource = async(payload: Resource, url: string) => {
    const response = await fetch(url, {
        method: 'POST',
        mode: 'same-origin',  // Do not send CSRF token to another domain.
        body: JSON.stringify(payload),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            'X-CSRFToken': getCookie('csrftoken'),
        },
    })
    const status = await response.status
    return status
}

export const getAthlete = (pk: number) => getResource(pk, athleteUrl)
export const changeAthlete = (payload: Resource) => changeResource(payload, athleteUrl)
export const deleteAthlete = (pk: number)  => deleteResource(pk, athleteUrl)

export const changeGear = (payload: Resource) => changeResource(payload, gearUrl)
export const deleteGear = (pk: number)  => deleteResource(pk, gearUrl)
export const createGear = (payload: Resource)  => createResource(payload, gearUrl)

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
