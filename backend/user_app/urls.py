from django.urls import path, register_converter
from .views import AllUsers, SelectedUser
from .converters import IntAndStrConverter


# All urls are prefaced by http://localhost:8000/api/v1/users/

register_converter(IntAndStrConverter, 'int_or_str')

urlpatterns = [
    path('', AllUsers.as_view(), name='all_users'),
    path('<int_or_str:id>/', SelectedUser.as_view(), name='selected_user'),
]