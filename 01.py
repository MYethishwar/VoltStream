devices = []


def add_device(name, room):
    
    device = {
        "name": name,
        "room": room
    }

    devices.append(device)

    return f"{name} added successfully in {room}"


def list_devices():

    if not devices:
        return "No devices found"

    result = "Devices:\n"

    for device in devices:
        result += f"- {device['name']} ({device['room']})\n"

    return result


def agent(user_message):

    user_message = user_message.lower()

    if "add" in user_message:

        words = user_message.split()


        device_name = words[1]
        room_name = words[-1]

        return add_device(device_name, room_name)

    
    elif "list" in user_message:

        return list_devices()

    
    else:

        return "Sorry, I did not understand."



print(agent("add tv in bathroom"))

print(agent("add fan in kitchen"))

print(agent("list devices"))