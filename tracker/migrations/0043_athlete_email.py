# Generated by Django 3.0.9 on 2020-12-09 05:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tracker', '0042_tokendata_athlete'),
    ]

    operations = [
        migrations.AddField(
            model_name='athlete',
            name='email',
            field=models.EmailField(default='barti.wroblewski@gmail.com', max_length=255),
        ),
    ]