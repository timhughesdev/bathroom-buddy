# backend/user_app/views.py
from django.shortcuts import render
from django.core.serializers import serialize
from django.contrib.auth.models import User

from reviews_app.models import Review


from rest_framework.views import APIView, Response
from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated, AllowAny

from .serializers import UserSerializer
from reviews_app.serializers import ReviewSerializer

import json



class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class AllUsers(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        
        users = User.objects.order_by('username')
        serialized_users = UserSerializer(users, many=True)

        return Response(serialized_users.data)
    
class SelectedUser(APIView):

    permission_classes = [AllowAny]
    
    def get_user(self, user_id): # adjusted to resolve lack of user. Commmented previous code just in case.
        try:
            if isinstance(user_id, int):
                return User.objects.get(id=user_id)
            else:
                return User.objects.get(username=user_id)
        except User.DoesNotExist:
            return None

    def get(self, request, user_id):
        selected_user = self.get_user(user_id)
        if selected_user:
            serialized_selected_user = UserSerializer(selected_user, many=False)
            return Response(serialized_selected_user.data)
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, user_id):
        selected_user = self.get_user(user_id)
        if not selected_user:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = UserSerializer(selected_user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, user_id):
        selected_user = self.get_user(user_id)
        selected_user_name = selected_user.username
        if not selected_user:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        selected_user.delete()
        return Response(f'{selected_user_name} has been deleted',status=status.HTTP_204_NO_CONTENT)