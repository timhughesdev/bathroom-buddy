from rest_framework import serializers

from .models import Image
from restroom_app.models import Restroom
from django.contrib.auth.models import User

from restroom_app.serializers import RestroomSerializer
from user_app.serializers import UserSerializer

class ImageSerializer(serializers.ModelSerializer):

    user = UserSerializer(many=False)
    restroom = RestroomSerializer(many=False)

    class Meta:

        model = Image
        fields = ('id', 'user', 'restroom', 'image_url', 'time_created')


    def create(self, validated_data):

        restroom_data = validated_data.pop('restroom')
        user_data = validated_data.pop('user')

        restroom, _ = Restroom.objects.get_or_create(
            name=restroom_data['name'],
            address=restroom_data['address'],
            latitude=restroom_data['latitude'],
            longitude=restroom_data['longitude'],
            time_created=restroom_data['time_created']
        )

        user = User.objects.filter(username=user_data['username']).first()
       
        image = Image.objects.create(user=user, restroom=restroom, **validated_data)
        return image
    
    def update(self, instance, validated_data):

        restroom_data = validated_data.pop('restroom')
        user_data = validated_data.pop('user')

        
        restroom = Restroom.objects.filter(name=restroom_data['name']).first() 
        instance.restroom = restroom   

        user = User.objects.filter(username=user_data['username']).first()
        instance.user = user

        instance.image_url = validated_data.get('image_url', instance.image_url)
        instance.time_created = validated_data.get('time_created', instance.time_created)
        instance.save()
        
        return instance