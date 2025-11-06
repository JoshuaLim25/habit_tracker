import sqlite3
from auth import hash_password

DB = "habit_tracker.db"

USERS = [
    ("Jurgen", "Baeza", "jdoe",  "jdoe@example.com",  "password123"),
    ("Alice",  "Smith", "asmith","asmith@example.com","letmein"),
]

def main():
    with sqlite3.connect(DB) as conn:
        cur = conn.cursor()
        for first, last, username, email, pw in USERS:
            cur.execute("""
                INSERT INTO users (first_name, last_name, username, email, password_hash)
                VALUES (?, ?, ?, ?, ?)
            """, (first, last, username, email, hash_password(pw)))
        conn.commit()
    print("✅ Seeded demo users with hashed passwords.")

if __name__ == "__main__":
    main()