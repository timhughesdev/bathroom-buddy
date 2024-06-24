# backend/reviews_app/views.py
from django.shortcuts import render
from django.core.serializers import serialize
from rest_framework.views import APIView, Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from .models import Review
from .serializers import ReviewSerializer
import json


class AllReviews(APIView):

    permission_classes=[AllowAny]

    def get(self, request):
        reviews = Review.objects.order_by('pk')
        serialized_restrooms = ReviewSerializer(reviews, many=True)
        return Response(serialized_restrooms.data)
    
    def post(self, request):

        print('here is the data', request.data)

        serialized_new_review = ReviewSerializer(data=request.data)
        if serialized_new_review.is_valid():
            serialized_new_review.save()
            return Response(serialized_new_review.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serialized_new_review.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
class SelectedReview(APIView):
    
    def get_review(self, id): # added try/except to cover lack of review
        try:
            return Review.objects.get(id = id)
        except Review.DoesNotExist:
            return None
     
    def get(self, request, id): # added if/else to cover no review
        selected_review = self.get_review(id)
        if selected_review:
            serialized_selected_review = ReviewSerializer(selected_review, many=False)
            return Response(serialized_selected_review.data)
        return Response({"error": "Review not found"}, status = status.HTTP_404_NOT_FOUND)

    def put(self, request, id):
        selected_review = self.get_review(id)
        if not selected_review:
            return Response({"error": "Review not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = ReviewSerializer(selected_review, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        selected_review = self.get_review(id)
        restroom_name = selected_review.restroom
        if not selected_review:
            return Response({"error": "Review not found"}, status=status.HTTP_404_NOT_FOUND)
        selected_review.delete()
        return Response(f'The review for {restroom_name} has been deleted',status=status.HTTP_204_NO_CONTENT)