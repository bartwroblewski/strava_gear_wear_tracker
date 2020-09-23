import os
import json

import requests

from django.shortcuts import render
from django.http import HttpResponse, JsonResponse, HttpResponseServerError
from django.shortcuts import render, redirect
from django.urls import reverse
from django.core.serializers import serialize
from django.contrib.auth import login, logout
from django.contrib.auth.models import User
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt


from rest_framework import viewsets
from rest_framework.exceptions import NotAuthenticated

from .models import Gear, Athlete, TokenData
from .serializers import GearSerializer

from .api import get_authorization_url, exchange_code_for_tokendata, get_activity, CLIENT_ID, CLIENT_SECRET

# Create your views here.
def index(request):
    return HttpResponse('ok')#render(request, 'frontend/index.html')

def authorize(request):
    after_auth_url=reverse('tracker:sessionize_tokendata')
    authorization_url = get_authorization_url(after_auth_url)
    return redirect(authorization_url)

def sessionize_tokendata(request):
    code = request.GET.get('code')
    tokendata = exchange_code_for_tokendata(code)
    request.session['tokendata'] = tokendata

    print(tokendata)

    # create or get athlete
    athlete, created = Athlete.objects.get_or_create(
        ref_id=tokendata['athlete']['id'],
        firstname=tokendata['athlete']['firstname'],
        lastname=tokendata['athlete']['lastname'],
    )

    tokendata_db = TokenData(
        expires_at=tokendata['expires_in'],
        expires_in=tokendata['expires_at'],
        access_token=tokendata['access_token'],
        refresh_token=tokendata['refresh_token'],
        athlete=athlete
    )
    tokendata_db.save()

    return redirect(reverse('tracker:react'))


def tokendata(request):
    response = {'tokendata': request.session['tokendata']}
    return JsonResponse(response)

def show_activity(request):
    access_token = request.session['tokendata']['access_token']
    activity_id = 4067853651
    activity = get_activity(activity_id, access_token)
    response = {'activity': activity}
    return JsonResponse(response)

# this is where Strava webhook event will post activity id once activity is created
def handle_new_activity_creation(request):
    return HttpResponse('OK')

def react(request):
    path = os.path.join(
        settings.REACT_APP_DIR,
        'build',
        'index.html',
    )
    with open(path) as f:
        return HttpResponse(f.read())

class GearViewSet(viewsets.ModelViewSet):
    serializer_class = GearSerializer

    def get_queryset(self):
        try:
            athlete_id = self.request.session['tokendata']['athlete']['id']
        except KeyError:
            # if no token in session
            raise NotAuthenticated
        athlete = Athlete.objects.get(ref_id=athlete_id)
        athlete_gear = Gear.objects.filter(athlete=athlete)
        return athlete_gear
        
def toggle_gear_tracking(request, gear_name):
    athlete_id = request.session['tokendata']['athlete']['id']
    athlete = Athlete.objects.get(ref_id=athlete_id)

    gear = Gear.objects.get(athlete=athlete, name=gear_name)
    gear.is_tracked = not gear.is_tracked
    gear.save()
    return HttpResponse('OK')

def delete_gear(request, gear_name):
    athlete_id = request.session['tokendata']['athlete']['id']
    athlete = Athlete.objects.get(ref_id=athlete_id)

    gear = Gear.objects.get(athlete=athlete, name=gear_name)
    gear.delete()
    return HttpResponse('OK')

def add_gear(request):
    athlete_id = request.session['tokendata']['athlete']['id']
    athlete = Athlete.objects.get(ref_id=athlete_id)

    gear_name = request.GET.get('gear_name')
    mileage = float(request.GET.get('mileage'))
    track = json.loads(request.GET.get('track'))
    print(gear_name, mileage, track)
    gear = Gear(
        name=gear_name,
        athlete=athlete,
    )
    try:
        gear.full_clean() # validate gear uniqueness per athlete
    except:
        #raise
        return HttpResponseServerError('Gear name already exists. Please use a unique name.')
    gear.mileage = mileage
    gear.is_tracked = track
    gear.save()
    return HttpResponse('OK')

def subscribe(request):
    url = 'https://www.strava.com/api/v3/push_subscriptions'
    params = {
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'callback_url': f'http://{settings.DOMAIN}/callback',
        'verify_token': 'STRAVA',
    }
    r = requests.post(url, params=params)
    return HttpResponse(r.text)

def mock_callback_post(request):
    url = request.build_absolute_uri(reverse('tracker:receive_mock'))
    print(url)
    r = requests.post(url, params={'object_id': 'some_id'})
    return HttpResponse(r.text)

@csrf_exempt
def receive_mock(request):
    print(request.body)
    return HttpResponse('OK')

@csrf_exempt # allow Strava webhook event POST request
def callback(request):
    print('CALLBACK REQUEST METHOD: ', request.method)
    # This url is called by Strava either on creating the subscription 
    # or when webhook event occurs
    if request.method == 'GET':
        hub_challenge = request.GET.get('hub.challenge')
        # if callback called while creating a webhook subsription,
        # just echo hub.challenge in the response
        verify_token = request.GET.get('hub.verify_token')
        print(f'VERIFY TOKEN: {verify_token}')
        response = {
            'hub.challenge': hub_challenge,
        }
        return JsonResponse(response)
    if request.method == 'POST':
        print(request.body)
        # if callback is responding to subscribed webhook event
        access_token = request.session['tokendata']['access_token']
        activity_id = request.POST.get('object_id')
    
        activity = get_activity(activity_id, access_token)

        #increase the mileage of all tracked gear by the activity distance
        athlete_id = request.session['tokendata']['athlete']['id']
        athlete = Athlete.objects.get(ref_id=athlete_id)

        tracked_athlete_gear = Gear.objects.filter(athlete=athlete, is_tracked=True)
        for gear in tracked_athlete_gear:
            gear.mileage += activity['distance']
            gear.save()
        return HttpResponse('OK')

def view_subscription(request):
    url = 'https://www.strava.com/api/v3/push_subscriptions'
    params = {
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
    }
    r = requests.get(url, params=params)
    return HttpResponse(r.json())

def delete_subscription(request):
    id = request.GET.get('id')
    url = f'https://www.strava.com/api/v3/push_subscriptions/{id}'
    params = {
        'id': id,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
    }
    r = requests.delete(url, params=params)
    return HttpResponse(r.text)

