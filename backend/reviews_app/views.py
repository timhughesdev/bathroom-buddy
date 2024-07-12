from django.shortcuts import render
from rest_framework.views import APIView, Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from .models import Review
from .serializers import ReviewSerializer

class AllReviews(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        reviews = Review.objects.order_by('pk')
        serialized_reviews = ReviewSerializer(reviews, many=True)
        return Response(serialized_reviews.data)

    def post(self, request):
        serialized_new_review = ReviewSerializer(data=request.data)
        if serialized_new_review.is_valid():
            serialized_new_review.save()
            return Response(serialized_new_review.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serialized_new_review.errors, status=status.HTTP_400_BAD_REQUEST)

    def options(self, request, *args, **kwargs):
        response = Response(status=status.HTTP_200_OK)
        response['Allow'] = 'GET, POST, OPTIONS'
        response['Access-Control-Allow-Origin'] = '*'
        response['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
        response['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        return response

class SelectedReview(APIView):
    permission_classes = [AllowAny]

    def get_review(self, id):
        try:
            return Review.objects.get(id=id)
        except Review.DoesNotExist:
            return None

    def get(self, request, id):
        selected_review = self.get_review(id)
        if selected_review:
            serialized_selected_review = ReviewSerializer(selected_review, many=False)
            return Response(serialized_selected_review.data)
        return Response({"error": "Review not found"}, status=status.HTTP_404_NOT_FOUND)

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
        if not selected_review:
            return Response({"error": "Review not found"}, status=status.HTTP_404_NOT_FOUND)
        restroom_name = selected_review.restroom.name if selected_review.restroom else "unknown"
        selected_review.delete()
        return Response(f'The review for {restroom_name} has been deleted', status=status.HTTP_204_NO_CONTENT)

    def options(self, request, *args, **kwargs):
        response = Response(status=status.HTTP_200_OK)
        response['Allow'] = 'GET, PUT, DELETE, OPTIONS'
        response['Access-Control-Allow-Origin'] = '*'
        response['Access-Control-Allow-Methods'] = 'GET, PUT, DELETE, OPTIONS'
        response['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        return response

class RestroomReviews(APIView):
    permission_classes = [AllowAny]

    def get(self, request, restroom_id):
        reviews = Review.objects.filter(restroom__api_restroom_key=restroom_id).order_by('-restroom__time_created')
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def options(self, request, *args, **kwargs):
        response = Response(status=status.HTTP_200_OK)
        response['Allow'] = 'GET, OPTIONS'
        response['Access-Control-Allow-Origin'] = '*'
        response['Access-Control-Allow-Methods'] = 'GET, OPTIONS'
        response['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        return response

