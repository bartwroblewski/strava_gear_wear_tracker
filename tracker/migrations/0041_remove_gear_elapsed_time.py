# Generated by Django 3.0.9 on 2020-12-05 18:25

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('tracker', '0040_auto_20201205_1841'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='gear',
            name='elapsed_time',
        ),
    ]