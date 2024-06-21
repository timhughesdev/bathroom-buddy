# backend/restroom_app/views.py

from django.shortcuts import render
from rest_framework.views import APIView, Response
from rest_framework import status
from .models import Restroom
from django.core.serializers import serialize
from .serializers import RestroomSerializer

import json


class AllRestrooms(APIView):

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
    
    def get_restroom(self, id):
        
        if type(id) == int:
            return Restroom.objects.get(id = id)
        else:
            return Restroom.objects.get(name = id)

    def get(self, request, id): 

        selected_restroom = self.get_restroom(id) # added "if" to check if restroom exists
        if selected_restroom:
            serialized_selected_restroom = RestroomSerializer(selected_restroom, many=False)
            return Response(serialized_selected_restroom.data)
        return Response({"error": "Restroom not found"}, status=status.HTTP_404_NOT_FOUND)
    
    # def post(self, request):
    #     serializer = RestroomSerializer(data=request.data)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response(serializer.data, status=status.HTTP_201_CREATED)
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)   
        
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
        name = selected_restroom.name
        if not selected_restroom:
            return Response({"error": "Restroom not found"}, status=status.HTTP_404_NOT_FOUND)
        selected_restroom.delete()
        return Response(f'{name} has been deleted',status=status.HTTP_204_NO_CONTENT)
    