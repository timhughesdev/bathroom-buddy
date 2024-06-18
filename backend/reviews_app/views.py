from django.shortcuts import render
from rest_framework.views import APIView, Response
from rest_framework import status
from .models import Review

from django.core.serializers import serialize
from .serializers import ReviewSerializer

import json


class AllReviews(APIView):

    def get(self, request):
        
        reviews = Review.objects.order_by('pk')
        serialized_restrooms = ReviewSerializer(reviews, many=True)

        return Response(serialized_restrooms.data)
    
    
class SelectedReview(APIView):
    
    def get_review(self, id):
        
        return Review.objects.get(id = id)
     
    def get(self, request, id):

        selected_review = self.get_review(id)
        serialized_selected_review = ReviewSerializer(selected_review, many=False)
        return Response(serialized_selected_review)
    