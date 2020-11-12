# Generated by Django 3.0.9 on 2020-11-10 16:43

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tracker', '0020_auto_20201026_1400'),
    ]

    operations = [
        migrations.AlterField(
            model_name='gear',
            name='mileage',
            field=models.FloatField(default=0, validators=[django.core.validators.MinValueValidator(0)]),
        ),
    ]