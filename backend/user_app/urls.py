from django.urls import path, register_converter, include
from .views import AllUsers, SelectedUser, CreateUserView
from .converters import IntAndStrConverter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# All urls are prefaced by http://localhost:8000/api/v1/users/

register_converter(IntAndStrConverter, 'int_or_str')

urlpatterns = [
    path('', AllUsers.as_view(), name='all_users'),
    path('register/', CreateUserView.as_view(), name='register_user'),
    path('token/', TokenObtainPairView.as_view(), name='get-token'),
    path('<int_or_str:user_id>/', SelectedUser.as_view(), name='selected_user')
]