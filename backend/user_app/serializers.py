from rest_framework.serializers import ModelSerializer
from django.contrib.auth.models import User


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['pk',"username", "password", 'email']


    def to_internal_value(self, data):
        if isinstance(data, dict):
            user = User.objects.filter(username=data.get('username')).first()
            if user:
                return {
                    'pk': user.pk,
                    'username': user.username,
                    'password': user.password,
                    'email': user.email
                }
        return super().to_internal_value(data)