import os
import yaml
from jinja2 import Environment, FileSystemLoader, select_autoescape

# Load YAML data
with open("content.yaml", "r") as f:
    data = yaml.safe_load(f)

# Set up Jinja environment
env = Environment(
    loader=FileSystemLoader("templates"),
    autoescape=select_autoescape(["html", "xml"])
)

template = env.get_template("index-jinja.html")

# Render template with YAML data
output = template.render(**data)

# Ensure dist directory exists
os.makedirs("dist", exist_ok=True)

# Write final HTML
with open("index-compiled.html", "w") as f:
    f.write(output)

print("Site successfully built → dist/index.html")

