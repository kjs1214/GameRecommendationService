
from django.urls import path
from .views import get_recommended_games_small

urlpatterns = [
    path('recommend/<int:user_id>/', get_recommended_games_small),
]
