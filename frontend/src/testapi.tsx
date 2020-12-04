export interface Resource {
    pk: number,
    //other optional here...
}

const domain: string =  'http://localhost:8000'//'http://f918bae6f5b0.ngrok.io'
const athleteUrl: string = domain + '/athlete_detail'
const gearUrl: string = domain + '/gear'

const getResource = async(pk: number, url: string): Promise<Resource> => {
    const response = await fetch(url + '/' + pk)
    const json = await response.json()
    return json
}

const changeResource = async(payload: Resource, url: string) => {
    const URL = athleteUrl + `/${payload.pk}`
    await fetch(URL, {
        method: 'POST',
        mode: 'same-origin',  // Do not send CSRF token to another domain.
        body: JSON.stringify(payload),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            'X-CSRFToken': getCookie('csrftoken'),
        },
    })
}

export const deleteResource = async(pk: number, url: string) => {
    const URL = url + '/' + pk
    await fetch(URL, {
        method: 'DELETE',
        mode: 'same-origin',  // Do not send CSRF token to another domain.
        headers: {
            'X-CSRFToken': getCookie('csrftoken'),
        },
    })
}

export const getAthlete = (pk: number) => getResource(pk, athleteUrl)
export const changeAthlete = (payload: Resource) => changeResource(payload, athleteUrl)
export const deleteAthlete = (pk: number)  => deleteResource(pk, athleteUrl)

export const changeGear = (payload: Resource) => changeResource(payload, gearUrl)
export const deleteGear = (pk: number)  => deleteResource(pk, gearUrl)

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
