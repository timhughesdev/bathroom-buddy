# backend/user_app/views.py
from django.shortcuts import render
from django.core.serializers import serialize
from django.contrib.auth.models import User
from rest_framework.views import APIView, Response
from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import UserSerializer
import json


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = User
    permission_classes = [AllowAny]


class AllUsers(APIView):

    def get(self, request):
        
        users = User.objects.order_by('username')
        serialized_users = UserSerializer(users, many=True)

        return Response(serialized_users.data)
    
class SelectedUser(APIView):
    
    def get_user(self, id): # adjusted to resolve lack of user. Commmented previous code just in case.
        try:
            if isinstance(id, int):
                return User.objects.get(id=id)
            else:
                return User.objects.get(username=id)
        except User.DoesNotExist:
            return None

    def get(self, request, id):
        selected_user = self.get_user(id)
        if selected_user:
            serialized_selected_user = UserSerializer(selected_user, many=False)
            return Response(serialized_selected_user.data)
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    
    # def post(self, request):
    #     serializer = UserSerializer(data=request.data)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response(serializer.data, status=status.HTTP_201_CREATED)
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, id):
        selected_user = self.get_user(id)
        if not selected_user:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = UserSerializer(selected_user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        selected_user = self.get_user(id)
        selected_user_name = selected_user.username
        if not selected_user:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        selected_user.delete()
        return Response(f'{selected_user_name} has been deleted',status=status.HTTP_204_NO_CONTENT)