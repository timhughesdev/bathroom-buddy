from django.urls import path, register_converter
from .views import AllReviews, SelectedReview, RestroomReviews
from .converters import IntConverter


# All urls are prefaced by http://localhost:8000/api/v1/reviews/

register_converter(IntConverter, 'int_or_str')

urlpatterns = [
    path('', AllReviews.as_view(), name='all_reviews'),
    path('<int_or_str:id>/', SelectedReview.as_view(), name='selected_reviews'),
    path('restroom/<int:restroom_id>/', RestroomReviews.as_view(), name='restroom_reviews'),
]