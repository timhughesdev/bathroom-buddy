# # Dockerfile
# FROM python:3.10-slim

# # Set work directory
# WORKDIR /app

# # Install dependencies
# COPY requirements.txt requirements.txt
# RUN pip install -r requirements.txt

# # Copy project
# COPY . .

# # Run the application
# CMD ["sh", "-c", "python manage.py migrate && gunicorn reputable_restrooms.wsgi:application --bind 0.0.0.0:8000"]

FROM python:3.11-buster

WORKDIR /src

COPY ./requirements.txt .

RUN pip install -r requirements.txt

COPY . .

CMD gunicorn --bind 0.0.0.0:8000 --workers 3 reputable_restrooms.wsgi:application
