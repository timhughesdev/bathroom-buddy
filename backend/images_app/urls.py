from django.urls import path, register_converter
from .views import AllImages, SelectedImage
from .converters import IntOrStrConverter
# Remember all urls are prefaced by http://localhost:8000/api/v1/images/

register_converter(IntOrStrConverter, 'int_or_str')

urlpatterns = [
    path('', AllImages.as_view(), name='all_images'),
    path('<int_or_str:id>/', SelectedImage.as_view(), name='selected_image'),
]