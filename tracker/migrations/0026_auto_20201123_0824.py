# Generated by Django 3.0.9 on 2020-11-23 07:24

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tracker', '0025_auto_20201119_1107'),
    ]

    operations = [
        migrations.RenameField(
            model_name='gear',
            old_name='moving_time',
            new_name='_moving_time',
        ),
        migrations.AddField(
            model_name='gear',
            name='moving_time_milestone',
            field=models.IntegerField(default=0, validators=[django.core.validators.MinValueValidator(0)]),
        ),
    ]
