# Generated by Django 3.0.9 on 2020-09-17 16:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tracker', '0003_auto_20200916_1456'),
    ]

    operations = [
        migrations.AlterField(
            model_name='gear',
            name='mileage',
            field=models.FloatField(default=0),
        ),
    ]
