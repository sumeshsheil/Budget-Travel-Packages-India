
import json
import os

filename = 'public/lottie/travel-smart.json'

if not os.path.exists(filename):
    print(f"File {filename} not found.")
    exit(1)

with open(filename, 'r') as f:
    data = json.load(f)

# Filter out the watermark layer 'Group Layer 8'
# We keep layers that are NOT named 'Group Layer 8'
initial_count = len(data.get('layers', []))
data['layers'] = [layer for layer in data.get('layers', []) if layer.get('nm') != 'Group Layer 8']
final_count = len(data['layers'])

if initial_count == final_count:
    print("No layer named 'Group Layer 8' found. Nothing removed.")
else:
    print(f"Removed {initial_count - final_count} layer(s) named 'Group Layer 8'.")

with open(filename, 'w') as f:
    json.dump(data, f, indent=2)
