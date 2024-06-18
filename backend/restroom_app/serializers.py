from rest_framework import serializers
from .models import Restroom

class RestroomSerializer(serializers.ModelSerializer):

    class Meta:

        model = Restroom
        fields = ('id', 'name', 'address', 'latitude', 'longitude', 'time_created')


    def to_internal_value(self, data):
        if isinstance(data, dict):
            restroom = Restroom.objects.filter(name=data.get('name')).first()
            if restroom:
                return {
                    'id': restroom.id,
                    'name': restroom.name,
                    'address': restroom.address,
                    'latitude': restroom.latitude,
                    'longitude': restroom.longitude,
                    'time_created': restroom.time_created
                }
        return super().to_internal_value(data)