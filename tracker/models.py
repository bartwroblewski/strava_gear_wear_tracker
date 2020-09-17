from django.db import models
from django.contrib.auth import get_user_model

# Create your models here.
class Gear(models.Model):
    name = models.CharField(max_length=200)
    mileage = models.FloatField()#(decimal_places=2, max_digits=8)
    is_tracked = models.BooleanField(default=True)
    user = models.ForeignKey(
        get_user_model(),
        on_delete=models.CASCADE,
        default=get_user_model().objects.first().id,
    )

    def __str__(self):
        return f'{self.name}, user: {self.user}, is tracked: {self.is_tracked}'