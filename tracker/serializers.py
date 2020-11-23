from rest_framework import serializers

from .models import Athlete, Gear, Bike

class BikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bike
        fields = ['ref_id', 'name', 'athlete']

class GearSerializer(serializers.ModelSerializer):
    bikes = BikeSerializer(many=True)
    #athlete = AthleteSerializer()
    class Meta:
        model = Gear
        fields = [
            'pk',
            'name',
            'distance',
            'moving_time', 
            'duration',
            'is_tracked', 
            #'athlete', 
            'bikes',
            'distance_in_athlete_unit',
        ]

class AthleteSerializer(serializers.ModelSerializer):
    gear = GearSerializer(many=True)
    class Meta:
        model = Athlete
        fields = ['pk', 'firstname', 'lastname', 'distance_unit', 'time_unit', 'gear']

