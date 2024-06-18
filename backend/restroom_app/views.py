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
    
    
class SelectedRestroom(APIView):
    
    def get_restroom(self, id):
        
        if type(id) == int:
            return Restroom.objects.get(id = id)
        else:
            return Restroom.objects.get(name = id)

    def get(self, request, id):

        selected_restroom = self.get_restroom(id)
        serialized_selected_restroom = RestroomSerializer(selected_restroom, many=False)
        return Response(serialized_selected_restroom)
    
    

    