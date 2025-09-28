import sqlite3

DB_PATH = "habit_tracker.db"

USERS = [
    ("Jurgen", "Baeza", "jdoe",  "jdoe@example.com",  "password123"),
    ("Alice",  "Smith", "asmith","asmith@example.com","letmein"),
    ("Bob",    "Lee",   "blee",  "bob.lee@example.com","hunter2"),
    # add more here...
]

def upsert_user(cur, first, last, username, email, password):
    """
    Insert a user; if the username OR email already exists, keep the existing row.
    Return that user's user_id either way.
    """
    try:
        cur.execute(
            """
            INSERT INTO users (first_name, last_name, username, email, password)
            VALUES (?, ?, ?, ?, ?)
            """,
            (first, last, username, email, password),
        )
        return cur.lastrowid
    except sqlite3.IntegrityError:
        # username or email is UNIQUE; fetch existing user_id
        cur.execute(
            "SELECT user_id FROM users WHERE username = ? OR email = ? LIMIT 1",
            (username, email),
        )
        row = cur.fetchone()
        if not row:
            raise
        return row[0]

def main():
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    user_ids = {}
    for first, last, username, email, pwd in USERS:
        uid = upsert_user(cur, first, last, username, email, pwd)
        user_ids[username] = uid
        print(f"{username} -> user_id={uid}")

    conn.commit()
    conn.close()
    print("All users inserted (or already existed).")

if __name__ == "__main__":
    main()