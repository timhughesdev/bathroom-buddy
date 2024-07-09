from rest_framework import serializers

from .models import Review
from restroom_app.models import Restroom
from django.contrib.auth.models import User

from restroom_app.serializers import RestroomSerializer
from user_app.serializers import UserSerializer


class ReviewSerializer(serializers.ModelSerializer):

    user = UserSerializer(many=False)
    restroom = RestroomSerializer(many=False)

    class Meta:

        model = Review
        fields = ('id', 'user', 'restroom', 'rating', 'comment', 'time_created')


    def create(self, validated_data):

        validated_data['rating'] = float(validated_data['rating'])

        restroom_data = validated_data.pop('restroom')
        user_data = validated_data.pop('user')

        restroom_data['latitude'] = float(restroom_data['latitude'])
        restroom_data['longitude'] = float(restroom_data['longitude'])

        restroom, created = Restroom.objects.get_or_create(
        api_restroom_key=restroom_data['api_restroom_key'],
        defaults={
            'name': restroom_data['name'],
            'address': restroom_data['address'],
            'latitude': restroom_data['latitude'],
            'longitude': restroom_data['longitude'],
            'time_created': restroom_data['time_created'],
        }
    )

        if not created:
            # Update the existing restroom record if necessary
            restroom.name = restroom_data['name']
            restroom.address = restroom_data['address']
            restroom.latitude = restroom_data['latitude']
            restroom.longitude = restroom_data['longitude']
            restroom.time_created = restroom_data['time_created']
            restroom.save()

        user = User.objects.filter(username=user_data['username']).first()
       
        review = Review.objects.create(user=user, restroom=restroom, **validated_data)
        return review
    
    def update(self, instance, validated_data):

        restroom_data = validated_data.pop('restroom')
        user_data = validated_data.pop('user')

        
        restroom = Restroom.objects.filter(name=restroom_data['name']).first() 
        instance.restroom = restroom   

        user = User.objects.filter(username=user_data['username']).first()
        instance.user = user

        instance.rating = validated_data.get('rating', instance.rating)
        instance.comment = validated_data.get('comment', instance.comment)
        instance.time_created = validated_data.get('time_created', instance.time_created)
        instance.save()
        
        return instance
   