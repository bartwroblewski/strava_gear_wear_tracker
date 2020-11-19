meters_in = {
    'kilometer': 1000,
    'mile': 1609,
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