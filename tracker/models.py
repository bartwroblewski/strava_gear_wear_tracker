from django.db import models
from django.core.validators import MinValueValidator

from .api import get_authenticated_athlete

class Athlete(models.Model):
    ref_id = models.IntegerField()
    firstname = models.CharField(max_length=255)
    lastname = models.CharField(max_length=255)
    distance_unit = models.CharField(default="km", max_length=255)
    time_unit = models.CharField(default="hour", max_length=255)

    def refresh_bikes(self, strava_access_token):
        athlete_data = get_authenticated_athlete(strava_access_token)
        strava_bikes = athlete_data.get('bikes') 
        strava_bikes_ids = [x['id'] for x in strava_bikes]

        for bike in self.bikes.all():
            if not bike.ref_id in strava_bikes_ids:
                bike.delete()
        for strava_bike in strava_bikes:
            if strava_bike['id'] not in [x.ref_id for x in self.bikes.all()]:
                new_bike = Bike(
                    ref_id=strava_bike['id'],
                    name=strava_bike['name'],
                    athlete=self
                )
                new_bike.save()

    def __str__(self):
        return f'{self.firstname} {self.lastname}'

class Bike(models.Model):
    ref_id = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    athlete = models.ForeignKey(Athlete, on_delete=models.CASCADE, default=1, related_name='bikes')

    def __str__(self):
        return f'{self.name}'

class Gear(models.Model):
    name = models.CharField(max_length=200)
    distance = models.FloatField(default=0, validators=[MinValueValidator(0)])
    distance_milestone = models.FloatField(default=0, validators=[MinValueValidator(0)])
    moving_time = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    moving_time_milestone = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    elapsed_time = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    is_tracked = models.BooleanField(default=True)
    athlete = models.ForeignKey(Athlete, on_delete=models.CASCADE, default=1, related_name='gear')
    bikes = models.ManyToManyField(Bike)

    def send_milestone_notifications(self):
        if self.distance >= self.distance_milestone and self.distance_milestone > 0:
            print(f"SENDING EMAIL FOR GEAR: {self.name}")

    def __str__(self):
        return f'{self.name}, athlete: {self.athlete.ref_id}, is tracked: {self.is_tracked}'

    class Meta:
        unique_together = ('name', 'athlete')

class TokenData(models.Model):
    expires_at = models.IntegerField()
    expires_in = models.IntegerField()
    access_token = models.TextField()
    refresh_token = models.TextField()

    def update(self, tokendata):
        '''Update with new tokendata received from Strava''' 
        self.expires_in=tokendata['expires_in']
        self.expires_at=tokendata['expires_at']
        self.access_token=tokendata['access_token']
        self.refresh_token=tokendata['refresh_token']
        self.save()


