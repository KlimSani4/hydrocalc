def calculate_water(weight: float, sex: str, activity: str) -> float:
    base_coeff = 35 if sex.lower() == "male" else 31

    activity_coeff = {
        "low": 1.0,
        "medium": 1.2,
        "high": 1.4
    }.get(activity.lower(), 1.0)

    return round(weight * base_coeff * activity_coeff, 2)
