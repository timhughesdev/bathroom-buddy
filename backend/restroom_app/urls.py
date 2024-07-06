from django.urls import path, register_converter
from .views import AllRestrooms, SelectedRestroom
from .converters import IntOrStrConverter


# All urls are prefaced by http://localhost:8000/api/v1/restrooms/

register_converter(IntOrStrConverter, 'int_or_str')

urlpatterns = [
    path('', AllRestrooms.as_view(), name='all_restrooms'),
    path('<int_or_str:id>/', SelectedRestroom.as_view(), name='selected_restroom'),
]
