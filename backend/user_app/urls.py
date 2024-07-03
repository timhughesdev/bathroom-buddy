from django.urls import path, register_converter, include
from .views import AllUsers, SelectedUser, CreateUserView, SelectedUserReviews, SelectedUserSelectedReview
from .converters import IntAndStrConverter, IntConverter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# All urls are prefaced by http://localhost:8000/api/users/

register_converter(IntAndStrConverter, 'int_or_str')
register_converter(IntConverter, 'int')

urlpatterns = [
    path('', AllUsers.as_view(), name='all_users'),
    path('register/', CreateUserView.as_view(), name='register_user'),
    path('token/', TokenObtainPairView.as_view(), name='get-token'),
    path('token/refresh/', TokenRefreshView.as_view(), name='refresh-token'),
    path('<int_or_str:user_id>/', SelectedUser.as_view(), name='selected_user'),
    path('<int_or_str:user_id>/reviews/', SelectedUserReviews.as_view(), name='selected_user'),
    path('<int_or_str:user_id>/reviews/<int:review_id>', SelectedUserSelectedReview.as_view(), name='selected_user'),
]