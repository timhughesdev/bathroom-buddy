from django.db import models
from django.contrib.auth.models import User
from restroom_app.models import Restroom
# Create your models here.

class Image(models.Model):
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    restroom = models.ForeignKey(Restroom, on_delete=models.CASCADE)
    image_url = models.TextField(null=False)
    time_created = models.DateTimeField(null=False)