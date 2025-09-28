import sqlite3
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User

class Command(BaseCommand):
    help = 'Migrates users from the old users table to the new auth_user table'

    def handle(self, *args, **kwargs):
        conn = sqlite3.connect('habit_tracker.db')
        cursor = conn.cursor()

        cursor.execute('SELECT username, password, email, first_name, last_name FROM users')
        users = cursor.fetchall()

        for user_data in users:
            username, password, email, first_name, last_name = user_data
            if not User.objects.filter(username=username).exists():
                User.objects.create_user(
                    username=username,
                    password=password,
                    email=email,
                    first_name=first_name,
                    last_name=last_name
                )
                self.stdout.write(self.style.SUCCESS(f'Successfully migrated user: {username}'))
            else:
                self.stdout.write(self.style.WARNING(f'User {username} already exists, skipping migration'))

        conn.close()
