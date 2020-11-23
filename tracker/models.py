import datetime

from django.db import models
from django.core.validators import MinValueValidator
from .unit_converter import from_meters, from_seconds, to_meters, to_seconds

class Athlete(models.Model):
    ref_id = models.IntegerField()
    firstname = models.CharField(max_length=255)
    lastname = models.CharField(max_length=255)
    distance_unit = models.CharField(default="kilometer", max_length=255)
    time_unit = models.CharField(default="hour", max_length=255)

    def __str__(self):
        return f'{self.firstname} {self.lastname}'

class Bike(models.Model):
    ref_id = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    athlete = models.ForeignKey(Athlete, on_delete=models.CASCADE, default=1)

    def __str__(self):
        return f'{self.name}'

class Gear(models.Model):
    name = models.CharField(max_length=200)
    distance = models.FloatField(default=0, validators=[MinValueValidator(0)])
    _moving_time = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    _moving_time_milestone = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    elapsed_time = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    is_tracked = models.BooleanField(default=True)
    athlete = models.ForeignKey(Athlete, on_delete=models.CASCADE, default=1, related_name='gear')
    bikes = models.ManyToManyField(Bike)
    """ bike = models.ForeignKey(
        Bike,
        on_delete=models.CASCADE,
        null=True,  # makes the field optional
        blank=True,
    ) """

    @property
    def remaining_to_milestones(self):
        return {
            'moving_time': self._moving_time_milestone - self._moving_time,
            'distance': 1,
        }

    def send_milestone_notifications(self):
        #if self.moving_time >= self.moving_time_milestone and self.moving_time_milestone > 0:
        if self.remaining_to_milestones['moving_time'] <= 0:
            print(f"SENDING EMAIL FOR GEAR: {self.name}")

    @property
    def moving_time(self):
        return self._moving_time
    
    @moving_time.setter
    def moving_time(self, seconds):
        self._moving_time = seconds

    @property
    def moving_time_milestone(self):
        return self._moving_time_milestone

    @moving_time_milestone.setter
    def moving_time_milestone(self, seconds):
        self._moving_time_milestone = seconds

    @property
    def duration(self):
        seconds = self.moving_time
        delta = datetime.timedelta(seconds=seconds)
        days = delta.days
        hours = seconds // 3600 - days * 24
        minutes = (seconds % 3600) // 60
        seconds = seconds % 60
        return {
            'string': str(delta),
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds,
        }

    @property
    def distance_in_athlete_unit(self):
        return round(from_meters(self.distance, self.athlete.distance_unit), 2)

    def distance_to_meters(self, distance):
        unit = self.athlete.distance_unit
        self.distance = to_meters(distance, unit)

    def __str__(self):
        return f'{self.name}, athlete: {self.athlete.ref_id}, is tracked: {self.is_tracked}'

    class Meta:
        unique_together = ('name', 'athlete')

class TokenData(models.Model):
    expires_at = models.IntegerField()
    expires_in = models.IntegerField()
    access_token = models.TextField()
    refresh_token = models.TextField()

