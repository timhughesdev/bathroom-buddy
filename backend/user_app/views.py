from django.shortcuts import render
from rest_framework.views import APIView, Response
from rest_framework import status
from django.contrib.auth.models import User


from django.core.serializers import serialize
from .serializers import UserSerializer

import json


class AllUsers(APIView):

    def get(self, request):
        
        users = User.objects.order_by('username')
        serialized_users = UserSerializer(users, many=True)

        return Response(serialized_users.data)
    
class SelectedUser(APIView):
    
    def get_user(self, id):
        
        if type(id) == int:
            return User.objects.get(id = id)
        else:
            return User.objects.get(username = id)

    def get(self, request, id):

        selected_user = self.get_user(id)
        serialized_selected_user = UserSerializer(selected_user, many=False)
        return Response(serialized_selected_user)
    