from rest_framework import serializers

from .models import Athlete, Gear, Bike

class BikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bike
        fields = ['ref_id', 'name']

class GearSerializer(serializers.ModelSerializer):
    bikes = BikeSerializer(many=True)
    #athlete = AthleteSerializer()
    class Meta:
        model = Gear
        fields = [
            'pk',
            'name',
            'distance',
            'distance_milestone',
            'moving_time', 
            'moving_time_milestone',
            'is_tracked', 
            'bikes',
        ]

class AthleteSerializer(serializers.ModelSerializer):
    gear = GearSerializer(many=True, read_only=True)
    bikes = BikeSerializer(many=True, read_only=True)
    class Meta:
        model = Athlete
        fields = ['pk', 'firstname', 'lastname', 'distance_unit', 'time_unit', 'gear', 'bikes']

