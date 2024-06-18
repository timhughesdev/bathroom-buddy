from rest_framework import serializers
from .models import Review
from restroom_app.serializers import RestroomSerializer
from user_app.serializers import UserSerializer


class ReviewSerializer(serializers.ModelSerializer):

    user = UserSerializer(many=False, read_only=True)
    restroom = RestroomSerializer(many=False, read_only=True)

    class Meta:

        model = Review
        fields = ('id', 'user', 'restroom', 'rating', 'comment', 'time_created')


   