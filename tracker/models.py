from django.db import models
from django.core.validators import MinValueValidator

meters_to = {
    'kilometers': 1000,
    'miles': 1609,
}

seconds_to = {
    'hours': 3600,
    'days': 86400,
}

def from_meters(meters, unit):
    return meters / meters_to[unit]

def from_seconds(seconds, unit):
    return seconds / seconds_to[unit]

def to_meters(number, from_unit):
    pass

def to_seconds(number, from_unit):
    pass

class Athlete(models.Model):
    ref_id = models.IntegerField()
    firstname = models.CharField(max_length=255)
    lastname = models.CharField(max_length=255)
    distance_unit = models.CharField(default="kilometers", max_length=255)
    time_unit = models.CharField(default="hours", max_length=255)

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
    mileage = models.FloatField(default=0, validators=[MinValueValidator(0)])
    moving_time = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    elapsed_time = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    is_tracked = models.BooleanField(default=True)
    athlete = models.ForeignKey(Athlete, on_delete=models.CASCADE, default=1)
    bikes = models.ManyToManyField(Bike)
    """ bike = models.ForeignKey(
        Bike,
        on_delete=models.CASCADE,
        null=True,  # makes the field optional
        blank=True,
    ) """

    @property
    def converted_distance(self):
        return from_meters(self.mileage, self.athlete.distance_unit)

    @property
    def converted_time(self):
        return from_seconds(self.moving_time, self.athlete.time_unit)

    def update_distance(self, distance):
        unit = self.athlete.distance_unit
        self.mileage += to_meters(distance, unit)

    def update_moving_time(self, time):
        unit = self.athlete.time_unit
        self.moving_time += to_seconds(time, unit)

    def __str__(self):
        return f'{self.name}, athlete: {self.athlete.ref_id}, is tracked: {self.is_tracked}'

    class Meta:
        unique_together = ('name', 'athlete')

class TokenData(models.Model):
    expires_at = models.IntegerField()
    expires_in = models.IntegerField()
    access_token = models.TextField()
    refresh_token = models.TextField()

