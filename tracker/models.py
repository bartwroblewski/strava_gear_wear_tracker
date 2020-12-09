import time
import operator

from django.db import models
from django.core.validators import MinValueValidator
from django.core.mail import send_mail

class Athlete(models.Model):
    ref_id = models.IntegerField()
    firstname = models.CharField(max_length=255)
    lastname = models.CharField(max_length=255)
    distance_unit = models.CharField(default="km", max_length=255)
    email = models.EmailField(max_length=255, default="barti.wroblewski@gmail.com")

    def update_bikes(self, strava_bikes):
        strava_bikes_ids = [x['id'] for x in strava_bikes]
        athlete_bikes_ids = [x.ref_id for x in self.bikes.all()]

        for bike in self.bikes.all():
            if not bike.ref_id in strava_bikes_ids:
                bike.delete()
        for strava_bike in strava_bikes:
            if strava_bike['id'] not in athlete_bikes_ids:
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
    is_tracked = models.BooleanField(default=True)
    athlete = models.ForeignKey(Athlete, on_delete=models.CASCADE, default=1, related_name='gear')
    bikes = models.ManyToManyField(Bike, blank=True)
    milestone_notification_sent = models.BooleanField(default=False)

    @property
    def moving_time_milestone_reached(self):
        return self.moving_time > self.moving_time_milestone

    @property
    def distance_milestone_reached(self):
        return self.distance > self.distance_milestone

    def send_milestone_notification(self):
        milestone_name = ''
        if self.moving_time_milestone_reached:
            milestone_name = 'time'
        elif self.distance_milestone_reached:
            milestone_name='distance'
        if milestone_name and not self.milestone_notification_sent:
            send_mail(
                'Gear milestone reached!',
                f'It seems that {self.name} has reached its {milestone_name} goal! Go to Gear Tracker for details.',
                'geartracker0@example.com',
                [self.athlete.email],
                fail_silently=False,
            )
            self.milestone_notification_sent = True
            self.save()

    def refresh_bikes(self, bike_ids):       
        self.bikes.clear()
        for bike_id in bike_ids:
            bike = Bike.objects.get(ref_id=bike_id)
            self.bikes.add(bike)
    
    def update(self, event_type, distance, moving_time):
        operation = {
            'create': operator.add,
            'delete': operator.sub,
            'update': lambda x, y: y,
        }[event_type]
        self.distance = operation(self.distance, distance)
        self.moving_time = operation(self.moving_time, moving_time)
        self.save()

    def __str__(self):
        return f'{self.name}, athlete: {self.athlete.ref_id}, is tracked: {self.is_tracked}'

    class Meta:
        unique_together = ('name', 'athlete')

class TokenData(models.Model):
    expires_at = models.IntegerField()
    expires_in = models.IntegerField()
    access_token = models.TextField()
    refresh_token = models.TextField()
    athlete = models.ForeignKey(Athlete, on_delete=models.CASCADE)

    def update(self, tokendata):
        '''Update with new tokendata received from Strava''' 
        self.expires_in=tokendata['expires_in']
        self.expires_at=tokendata['expires_at']
        self.access_token=tokendata['access_token']
        self.refresh_token=tokendata['refresh_token']
        self.save()

    @property
    def expired(self):
        return time.time() > self.expires_at



