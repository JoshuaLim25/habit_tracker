import sqlite3

DB_PATH = "habit_tracker.db"

def connect_with_email(email, password):
    """
    Try to connect (log in) with an email and password.
    Returns user_id if successful, else None.
    """
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    cur.execute(
        "SELECT user_id, first_name, last_name, username FROM users WHERE email = ? AND password = ?",
        (email, password),
    )
    row = cur.fetchone()
    conn.close()

    if row:
        user_id, first, last, username = row
        print(f"Connected as {first} {last} (@{username}), user_id={user_id}")
        return user_id
    else:
        print("Email/password invalid.")
        return None

def main():
    # Example connections
    connect_with_email("jdoe@example.com", "password123")
    connect_with_email("asmith@example.com", "wrongpassword")

if __name__ == "__main__":
    main()