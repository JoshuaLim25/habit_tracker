import sqlite3

# Connect to the database you created
conn = sqlite3.connect("habit_tracker.db")
cursor = conn.cursor()

# Insert a sample user (⚠️ password is plain text for now)
cursor.execute("""
INSERT INTO users (username, email, password)
VALUES (?, ?, ?)
""", ("jdoe", "jdoe@example.com", "password123"))

# Insert a couple of habits for that user (user_id = 1 here)
cursor.execute("""
INSERT INTO habits (user_id, habit_name, duration)
VALUES (?, ?, ?)
""", (1, "Read for 30 min", "30 min"))

cursor.execute("""
INSERT INTO habits (user_id, habit_name, duration)
VALUES (?, ?, ?)
""", (1, "Went for a run", "1 hour"))

conn.commit()
print("Sample user and habits inserted!")
conn.close()
