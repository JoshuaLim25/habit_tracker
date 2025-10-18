from django.urls import path
from .views import HabitLogCreateView

urlpatterns = [
    path('log/', HabitLogCreateView.as_view(), name='habit-log-create'),
]
