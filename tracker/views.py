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

from .models import Gear
from .serializers import GearSerializer

from .api import get_authorization_url, exchange_code_for_tokendata, get_activity, CLIENT_ID, CLIENT_SECRET

# Create your views here.
def index(request):
    return render(request, 'frontend/index.html')

def authorize(request):
    after_auth_url=reverse('tracker:sessionize_tokendata')
    authorization_url = get_authorization_url(after_auth_url)
    return redirect(authorization_url)

def sessionize_tokendata(request):
    code = request.GET.get('code')
    tokendata = exchange_code_for_tokendata(code)
    request.session['tokendata'] = tokendata
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
    access_token = request.session['tokendata']['access_token']
    activity_id = request.GET.get('object_id')
    
    activity = get_activity(activity_id, access_token)
    
    #increase the mileage of all tracked gear by the activity distance
    user = request.user
    tracked_user_gear = Gear.objects.filter(user=user, is_tracked=True)
    for gear in tracked_user_gear:
        gear.mileage += activity['distance']
        gear.save()
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
        user = self.request.user
        if user.is_authenticated:
            user_gear = Gear.objects.filter(user=user)
            return user_gear
        else:
            raise NotAuthenticated

def toggle_gear_tracking(request, gear_name):
    user = request.user
    gear = Gear.objects.get(user=user, name=gear_name)
    gear.is_tracked = not gear.is_tracked
    gear.save()
    return HttpResponse('OK')

def delete_gear(request, gear_name):
    user = request.user
    gear = Gear.objects.get(user=user, name=gear_name)
    gear.delete()
    return HttpResponse('OK')

def add_gear(request):
    user = request.user
    gear_name = request.GET.get('gear_name')
    mileage = float(request.GET.get('mileage'))
    track = json.loads(request.GET.get('track'))
    print(gear_name, mileage, track)
    gear = Gear(
        name=gear_name,
        user=user,
    )
    try:
        gear.full_clean() # validate gear uniqueness per user
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
        'callback_url': 'http://e7ba08f76534.ngrok.io/callback',
        'verify_token': 'STRAVA',
    }
    r = requests.post(url, params=params)
    print(r.__dict__)
    return HttpResponse('OK')

@csrf_exempt
def callback(request):
    hub_challenge = request.GET.get('hub.challenge')
    verify_token = request.GET.get('hub.verify_token')
    print(f'VERIFY TOKEN: {verify_token}')
    response = {
        'hub.challenge': hub_challenge,
    }
    return redirect(reverse('tracker:handle_new_activity_creation'))#JsonResponse(response)

def view_subscription(request):
    url = 'https://www.strava.com/api/v3/push_subscriptions'
    params = {
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
    }
    r = requests.get(url, params=params)
    for k, v in r.__dict__.items():
        print(k, v)
    return HttpResponse('OK')
