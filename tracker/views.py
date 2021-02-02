import os
import json
import time

import requests

from django.shortcuts import render, get_object_or_404, redirect
from django.http import HttpResponse, JsonResponse, HttpResponseServerError
from django.urls import reverse
from django.core.exceptions import ValidationError
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from django.db.utils import IntegrityError

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import NotAuthenticated, NotFound, PermissionDenied
from rest_framework import status
from rest_framework import serializers

from .models import Gear, Athlete, TokenData, Bike
from .serializers import GearSerializer, AthleteSerializer

from .api import (
    get_authorization_url,
    exchange_code_for_tokendata, 
    get_authenticated_athlete,
    get_activity,
    get_new_access_token,
    CLIENT_ID, 
    CLIENT_SECRET,
)

def index(request):
    return render(request, 'frontend/index.html')

def authorize(request):
    after_auth_url=reverse('tracker:sessionize_tokendata')
    authorization_url = get_authorization_url(after_auth_url)
    return redirect(authorization_url)

def sessionize_tokendata(request):
    '''Redirect URL for Strava auth mechanism.
    Receives code that can be exchanged for API access tokens.'''

    code = request.GET.get('code')
    tokendata = exchange_code_for_tokendata(code)

    # store token in session to allow user interactions
    request.session['tokendata'] = tokendata

    # store token in database for use in webhook callback
    athlete, created = Athlete.objects.get_or_create(
        ref_id=tokendata['athlete']['id'],
        firstname=tokendata['athlete']['firstname'],
        lastname=tokendata['athlete']['lastname'],
    )
    athlete_db_tokendata, created = TokenData.objects.get_or_create(
        expires_in=tokendata['expires_in'],
        expires_at=tokendata['expires_at'],
        access_token=tokendata['access_token'],
        refresh_token=tokendata['refresh_token'],
        athlete=athlete,
    )
    print('TOKENDATA', athlete_db_tokendata)
    athlete_db_tokendata.update(tokendata)
    
    #refresh athlete bikes
    athlete_data = get_authenticated_athlete(athlete_db_tokendata.access_token)
    strava_bikes = athlete_data.get('bikes') 
    athlete.update_bikes(strava_bikes)

    return redirect(reverse('tracker:index'))

def get_authorization_status(request):
    """
    1. Check if:
        A. Token is in session (i.e. user has authorized already);
        B. The token is not expired.
    2. If authorized, include athlete.pk in the response, otherwise include 0.
    """
    tokendata = request.session.get('tokendata')
    if tokendata:
        expired = time.time() > tokendata['expires_at']
        if not expired:
            athlete_id = tokendata['athlete']['id']
            athlete = Athlete.objects.get(ref_id=athlete_id)
            return HttpResponse(athlete.pk)
    return HttpResponse(0)

class AthleteDetail(APIView):
    """
    Get or update athlete.
    """
    def get_object(self, pk):
        return get_object_or_404(Athlete, pk=pk)

    def get(self, request, pk):
        athlete = self.get_object(pk)
        serializer = AthleteSerializer(athlete)
        return JsonResponse(serializer.data)

    def put(self, request, pk):
        athlete = self.get_object(pk)
        serializer = AthleteSerializer(athlete, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GearList(APIView):
    """
    List all gear or create new gear.
    """
    def get(self, request):
        gear = Gear.objects.all()
        serializer = GearSerializer(gear, many=True)
        return Response(serializer.data)

    def post(self, request):
        athlete_id = request.session['tokendata']['athlete']['id']
        athlete = Athlete.objects.get(ref_id=athlete_id)
        serializer = GearSerializer(data=request.data)
        if serializer.is_valid():
            try:
                gear = serializer.save(athlete=athlete)
            except IntegrityError as e: # "unique together" constraint error is set on Gear model,                             
                not_unique_error = {    # so the error has to be handled manually, not by the serializer
                    'message': 'You already have gear by this name, please use another!'
                }
                return Response(not_unique_error, status=status.HTTP_400_BAD_REQUEST)
            gear.refresh_bikes(request.data.get('bikes'))
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GearDetail(APIView):
    """
    Retrieve, update or delete gear.
    """
    def get_object(self, pk):
        return get_object_or_404(Gear, pk=pk)

    def get(self, request, pk):
        gear = self.get_object(pk)
        serializer = GearSerializer(gear)
        return Response(serializer.data)

    def put(self, request, pk):
        gear = self.get_object(pk)
        serializer = GearSerializer(gear, data=request.data)
        athlete_id = request.session['tokendata']['athlete']['id']
        athlete = Athlete.objects.get(ref_id=athlete_id)
        if serializer.is_valid():
            try:
                gear = serializer.save(athlete=athlete)
            except IntegrityError as e: # "unique together" constraint error is set on Gear model,                             
                not_unique_error = {    # so the error has to be handled manually, not by the serializer
                    'message': 'You already have gear by this name, please use another!'
                }
                return Response(not_unique_error, status=status.HTTP_400_BAD_REQUEST)
            gear.refresh_bikes(request.data.get('bikes'))
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        gear = self.get_object(pk)
        gear.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@csrf_exempt # allow Strava webhook event POST request
def strava_callback(request):
    """
    This url is called by Strava either on creating the subscription 
    or when webhook event occurs.
    """
    if request.method == 'GET':
        hub_challenge = request.GET.get('hub.challenge')

        # if callback called while creating a webhook subscription,
        # just echo hub.challenge in the response
        verify_token = request.GET.get('hub.verify_token')
        response = {
            'hub.challenge': hub_challenge,
        }
        return JsonResponse(response)

    if request.method == 'POST':
        body = json.loads(request.body)

        if body['object_type'] == 'activity':
            activity_id = body['object_id']
            athlete_id = body['owner_id']

            athlete = Athlete.objects.get(ref_id=athlete_id)
            athlete_tokendata = TokenData.objects.get(athlete=athlete)
            if athlete_tokendata.expired:
                new_tokendata = get_new_access_token(athlete_tokendata.refresh_token)
                athlete_tokendata.update(new_tokendata)

            # refresh athlete bikes
            athlete_data = get_authenticated_athlete(athlete_tokendata.access_token)
            strava_bikes = athlete_data.get('bikes') 
            athlete.update_bikes(strava_bikes)

            activity = get_activity(activity_id, athlete_tokendata.access_token)
            bike_id = activity['gear_id']       
            try:
                bike = Bike.objects.get(ref_id=bike_id)
            except Bike.DoesNotExist:
                bike = None

            # update only gear which bikes include the activity bike
            tracked_athlete_gear = Gear.objects.filter(
                athlete=athlete, 
                #is_tracked=True,
                bikes=bike,
            )
            aspect_type = body['aspect_type']
            for gear in tracked_athlete_gear:
                gear.update(
                    aspect_type,
                    activity['distance'],
                    activity['moving_time'],
                )
                #gear.send_milestone_notification()
        return HttpResponse('OK')

def mock_callback_post(request):
    url = request.build_absolute_uri(reverse('tracker:strava_callback'))
    print(url)
    r = requests.post(url, json={
        'object_id': '4397165165',
        'owner_id': '5303167',
        'object_type': 'activity',
        'aspect_type': 'create',
    })
    return HttpResponse(r.text)

@csrf_exempt
def receive_mock(request):
    print(request.body)
    return HttpResponse('OK')

def logout(request):
    request.session.flush()
    return HttpResponse('OK')