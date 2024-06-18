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
        pass
    
    

    