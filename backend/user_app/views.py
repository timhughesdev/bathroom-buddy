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

    permission_classes = [AllowAny]

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
    

# This view will be used to view all reviews from a specific user

class SelectedUserReviews(APIView):

    permission_classes = [AllowAny]
    
    def get_user_reviews(self, user_id):
        
        return Review.objects.filter(user=user_id)
    
    def get(self, request, user_id):

        user_reviews = self.get_user_reviews(user_id)
        if user_reviews:
            serialized_user_reviews = ReviewSerializer(user_reviews, many=True)
            return Response(serialized_user_reviews.data)
        return Response({"error": "User does not have an reviews posted"}, status=status.HTTP_404_NOT_FOUND)
    
# This view will be used to view a specific review from a specific user, as well as update and delete them

class SelectedUserSelectedReview(APIView):

    permission_classes = [AllowAny]

    def get_user_review(self, user_id, review_id):
        try:
            return Review.objects.get(user=user_id, id=review_id)
        except Review.DoesNotExist:
            return None
    
    def get(self, request, user_id, review_id):

        user_review = self.get_user_review(user_id, review_id)
        
        if user_review:
            serialized_user_reviews = ReviewSerializer(user_review, many=False)
            return Response(serialized_user_reviews.data)
        return Response({"error": "Review not found"}, status=status.HTTP_404_NOT_FOUND)
    
    def put(self, request, user_id, review_id):

        user_review = self.get_user_review(user_id, review_id)
        serialized_selected_review = ReviewSerializer(user_review, data=request.data)

        if serialized_selected_review.is_valid():
            serialized_selected_review.save()
            return Response(serialized_selected_review.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serialized_selected_review.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, user_id, review_id):

        review = self.get_user_review(user_id, review_id)

        if review:
            review_user = review.user
            review_restroom = review.restroom

            review.delete()

            return Response(f'The review created by {review_user} for the restroom {review_restroom} has been deleted!')
        return Response({"error": "Review not found"}, status=status.HTTP_404_NOT_FOUND)
        
    

           