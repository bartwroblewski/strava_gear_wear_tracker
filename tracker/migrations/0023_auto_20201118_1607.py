# Generated by Django 3.0.9 on 2020-11-18 15:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tracker', '0022_auto_20201117_1403'),
    ]

    operations = [
        migrations.AddField(
            model_name='athlete',
            name='distance_unit',
            field=models.CharField(default='kilometers', max_length=255),
        ),
        migrations.AddField(
            model_name='athlete',
            name='time_unit',
            field=models.CharField(default='hours', max_length=255),
        ),
    ]