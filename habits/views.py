from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Habit, HabitLog
from .serializers import HabitLogSerializer
from django.core.exceptions import PermissionDenied

class HabitLogCreateView(generics.CreateAPIView):
    queryset = HabitLog.objects.all()
    serializer_class = HabitLogSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        habit = serializer.validated_data['habit']
        if habit.user != self.request.user:
            raise PermissionDenied("You do not have permission to log this habit.")
        serializer.save()
