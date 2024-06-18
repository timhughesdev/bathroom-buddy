from rest_framework import serializers
from .models import Restroom

class RestroomSerializers(serializers.ModelSerializer):

    class Meta:

        model = Restroom
        fields = ('id', 'name', 'address', 'latitude', 'longitude')


    