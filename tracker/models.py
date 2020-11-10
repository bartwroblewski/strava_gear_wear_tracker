from django.db import models
from django.core.validators import MinValueValidator

def unique_gear_name_validator(gear_name):
    pass

# Create your models here.

class Athlete(models.Model):
    ref_id = models.IntegerField()
    firstname = models.CharField(max_length=255)
    lastname = models.CharField(max_length=255)

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
    is_tracked = models.BooleanField(default=True)
    athlete = models.ForeignKey(Athlete, on_delete=models.CASCADE, default=1)
    bikes = models.ManyToManyField(Bike)
    """ bike = models.ForeignKey(
        Bike,
        on_delete=models.CASCADE,
        null=True,  # makes the field optional
        blank=True,
    ) """

    def __str__(self):
        return f'{self.name}, athlete: {self.athlete.ref_id}, is tracked: {self.is_tracked}'

    class Meta:
        unique_together = ('name', 'athlete')

class TokenData(models.Model):
    expires_at = models.IntegerField()
    expires_in = models.IntegerField()
    access_token = models.TextField()
    refresh_token = models.TextField()

