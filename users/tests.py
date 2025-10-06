from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status

class AuthTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user_data = {
            'username': 'testuser',
            'password': 'testpassword',
            'email': 'test@example.com',
            'first_name': 'Test',
            'last_name': 'User'
        }
        self.user = User.objects.create_user(**self.user_data)

    def test_user_registration(self):
        """
        create a new user
        """
        url = '/api/users/register/'
        data = {
            'username': 'newuser',
            'password': 'newpassword',
            'email': 'new@example.com',
            'first_name': 'New',
            'last_name': 'User'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 2)
        self.assertEqual(User.objects.get(username='newuser').email, 'new@example.com')

    def test_user_login(self):
        """
        user can log in and get a token
        """
        url = '/api/users/login/'
        data = {
            'username': 'testuser',
            'password': 'testpassword'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_access_protected_endpoint_with_token(self):
        """
        we can access a protected endpoint with a valid token
        """
        login_url = '/api/users/login/'
        login_data = {
            'username': 'testuser',
            'password': 'testpassword'
        }
        login_response = self.client.post(login_url, login_data, format='json')
        token = login_response.data['access']

        protected_url = '/api/users/protected/'
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        response = self.client.get(protected_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message'], 'This is a protected endpoint for authenticated users only.')

    def test_access_protected_endpoint_without_token(self):
        """
        we can't access a protected endpoint without a token
        """
        url = '/api/users/protected/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_access_protected_endpoint_with_invalid_token(self):
        """
        we cant' access a protected endpoint with an invalid token.
        """
        url = '/api/users/protected/'
        self.client.credentials(HTTP_AUTHORIZATION='Bearer invalidtoken')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
