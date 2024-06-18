from django.shortcuts import render
from rest_framework.views import APIView, Response
from rest_framework import status
from .models import Image

from django.core.serializers import serialize
from .serializers import ImageSerializer 

class AllImages(APIView):

    def get(self, request):
        
        images = Image.objects.order_by('pk')
        serialized_images = ImageSerializer(images, many=True)

        return Response(serialized_images.data)
    
    def post(self, request):

        serialized_new_image = ImageSerializer(data=request.data)
        if serialized_new_image.is_valid():
            serialized_new_image.save()
            return Response(serialized_new_image.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serialized_new_image.errors, status=status.HTTP_400_BAD_REQUEST)
    
class SelectedImage(APIView):
    
    def get_image(self, id):

        return Image.objects.get(id=id)

    def get(self, request, id):

        selected_image = self.get_image(id)
        serialized_selected_image = ImageSerializer(selected_image, many=False)
        return Response(serialized_selected_image.data)
    
    def put(self, request, id):

        selected_image = self.get_image(id)
        serialized_selected_image = ImageSerializer(selected_image, data=request.data)

        if serialized_selected_image.is_valid():
            serialized_selected_image.save()
            return Response(serialized_selected_image.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serialized_selected_image.errors, status=status.HTTP_400_BAD_REQUEST)
        
    def delete(self, request, id):

        selected_image = self.get_image(id)
        restroom_name = selected_image.restroom

        print(restroom_name)
        selected_image.delete()

        return Response(f'The image for {restroom_name} has been deleted!')
    
    
