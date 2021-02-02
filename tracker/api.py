import os

import requests

from django.conf import settings

CLIENT_ID = settings.CLIENT_ID
CLIENT_SECRET = settings.CLIENT_SECRET
SCOPE = 'activity:read_all,read_all,profile:read_all'

def get_authorization_url(after_auth_url):
    if settings.DOMAIN == 'localhost':
        domain = f'http://{settings.DOMAIN}:8000'
    else:
        domain = f'http://{settings.DOMAIN}'
    return (
        'http://www.strava.com/oauth/authorize?'
        f'client_id={CLIENT_ID}&response_type=code&'
        f'redirect_uri={domain}{after_auth_url}&approval_prompt=force&'
        f'scope={SCOPE}'
    )

def exchange_code_for_tokendata(code):
    url = 'https://www.strava.com/oauth/token'
    params = {
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'code': code,
        'grant_type': 'authorization_code',
    }
    r = requests.post(url, params=params)
    tokendata = r.json()
    return tokendata

def get_activity(activity_id, access_token):
    url = f'https://www.strava.com/api/v3/activities/{activity_id}'
    headers = {
        'Authorization': f'Bearer {access_token}',
    }
    r = requests.get(url, headers=headers)
    activity = r.json()
    return activity

def get_authenticated_athlete(access_token):
    url = f'https://www.strava.com/api/v3/athlete'
    headers = {
        'Authorization': f'Bearer {access_token}',
    }
    r = requests.get(url, headers=headers)
    athlete = r.json()
    return athlete

def get_new_access_token(refresh_token):
    url = f'https://www.strava.com/oauth/token'
    params = {
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'refresh_token': refresh_token,
        'grant_type': 'refresh_token',
    }
    r = requests.post(url, params=params)
    tokendata = r.json()
    return tokendata

def subscribe_to_strava_webhook():
    url = 'https://www.strava.com/api/v3/push_subscriptions'
    params = {
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'callback_url': f'http://{settings.DOMAIN}/strava_callback',
        'verify_token': 'STRAVA',
    }
    r = requests.post(url, params=params)
    return r.text

def unsubscribe_to_strava_webhook(subscription_id):
    #id = request.GET.get('id')
    url = f'https://www.strava.com/api/v3/push_subscriptions/{subscription_id}'
    params = {
        'id': subscription_id,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
    }
    r = requests.delete(url, params=params)
    return r.text

def get_webhook_subscription():
    url = 'https://www.strava.com/api/v3/push_subscriptions'
    params = {
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
    }
    r = requests.get(url, params=params)
    return r.json()
