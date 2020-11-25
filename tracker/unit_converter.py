from django.contrib.gis.measure import D

def meters_to_unit(meters, unit):
    return getattr(D(m=meters), unit)

def unit_to_meters(distance, unit):
    args = {unit: distance}
    d = D(**args)
    return d







meters_in = {
    'km': 1000,
    'mi': 1609,
}
seconds_in = {
    'hour': 3600,
    'day': 86400,
}

def from_meters(n_meters, to_unit):
    return n_meters / meters_in[to_unit]

def from_seconds(n_seconds, to_unit):
    return n_seconds / seconds_in[to_unit]

def to_meters(number, from_unit):
    return number * meters_in[from_unit]

def to_seconds(number, from_unit):
    return number * seconds_in[from_unit]