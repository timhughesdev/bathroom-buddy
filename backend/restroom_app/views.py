from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.views import APIView, Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Restroom
from django.core.serializers import serialize
from .serializers import RestroomSerializer
import json

class AllRestrooms(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        restrooms = Restroom.objects.order_by('pk')
        serialized_restrooms = RestroomSerializer(restrooms, many=True)
        return Response(serialized_restrooms.data)

    def post(self, request):
        serialized_new_restroom = RestroomSerializer(data=request.data)
        if serialized_new_restroom.is_valid():
            serialized_new_restroom.save()
            return Response(serialized_new_restroom.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serialized_new_restroom.errors, status=status.HTTP_400_BAD_REQUEST)

class SelectedRestroom(APIView):
    permission_classes = [AllowAny]

    def get_restroom(self, id):
        try:
            return Restroom.objects.get(id=id) if isinstance(id, int) else Restroom.objects.get(name=id)
        except Restroom.DoesNotExist:
            return None

    def get(self, request, id):
        selected_restroom = self.get_restroom(id)
        if selected_restroom:
            serialized_selected_restroom = RestroomSerializer(selected_restroom, many=False)
            return Response(serialized_selected_restroom.data)
        return Response({"error": "Restroom not found"}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, id):
        selected_restroom = self.get_restroom(id)
        if not selected_restroom:
            return Response({"error": "Restroom not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = RestroomSerializer(selected_restroom, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        selected_restroom = self.get_restroom(id)
        if not selected_restroom:
            return Response({"error": "Restroom not found"}, status=status.HTTP_404_NOT_FOUND)
        name = selected_restroom.name
        selected_restroom.delete()
        return Response(f'{name} has been deleted',status=status.HTTP_204_NO_CONTENT)
    

    