import sqlite3

# Connect to SQLite (this creates habit_tracker.db file if it doesn’t exist)
conn = sqlite3.connect("habit_tracker.db")
cursor = conn.cursor()

# Create User table
cursor.execute("""
CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);
""")

# Create Habits table
cursor.execute("""
CREATE TABLE IF NOT EXISTS habits (
    habit_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    habit_name TEXT NOT NULL,
    duration TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
""")

conn.commit()
print("Database and tables created successfully!")
conn.close()
