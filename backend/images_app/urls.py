from django.urls import path, register_converter
from .views import AllImages, SelectedImage
from .converters import IntConverter
# Remember all urls are prefaced by http://localhost:8000/api/v1/images/

register_converter(IntConverter, 'int')

urlpatterns = [
    path('', AllImages.as_view(), name='all_images'),
    path('<int:id>/', SelectedImage.as_view(), name='selected_image'),
]