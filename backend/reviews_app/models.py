from django.db import models
from django.contrib.auth.models import User
from restroom_app.models import Restroom
# Create your models here.

class Review(models.Model):
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_reviews')
    restroom = models.ForeignKey(Restroom, on_delete=models.CASCADE, related_name='restroom_reviews')
    rating = models.DecimalField(max_digits=2, decimal_places=1)
    comment = models.TextField()
    time_created = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f'Review for {self.restroom.name}'
    

