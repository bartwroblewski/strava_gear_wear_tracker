# Generated by Django 3.0.9 on 2020-11-25 05:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tracker', '0030_auto_20201125_0634'),
    ]

    operations = [
        migrations.AlterField(
            model_name='athlete',
            name='distance_unit',
            field=models.CharField(default='kilometer', max_length=255),
        ),
        migrations.AlterField(
            model_name='athlete',
            name='time_unit',
            field=models.CharField(default='hour', max_length=255),
        ),
    ]