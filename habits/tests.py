from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Habit, HabitLog

class HabitTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.client.login(username='testuser', password='testpassword')

    def test_create_habit(self):
        """create a new habit object."""
        Habit.objects.create(user=self.user, name='Test Habit')
        self.assertEqual(Habit.objects.count(), 1)
        self.assertEqual(Habit.objects.get().name, 'Test Habit')

class HabitLogTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.other_user = User.objects.create_user(username='otheruser', password='otherpassword')
        self.habit = Habit.objects.create(user=self.user, name='Test Habit')
        self.client.login(username='testuser', password='testpassword')

    def test_create_habit_log(self):
        """create a new habit log object."""
        url = '/api/habits/log/'
        data = {'habit': self.habit.id}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(HabitLog.objects.count(), 1)
        self.assertEqual(HabitLog.objects.get().habit, self.habit)

    def test_unauthenticated_user_cannot_create_habit_log(self):
        """show that an unauthenticated user cannot create a habit log."""
        self.client.logout()
        url = '/api/habits/log/'
        data = {'habit': self.habit.id}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_user_cannot_log_habit_for_other_user(self):
        """one user cannot log a habit for another"""
        other_habit = Habit.objects.create(user=self.other_user, name='Other User Habit')
        url = '/api/habits/log/'
        data = {'habit': other_habit.id}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
