import unittest

from habit_tracker.app import _to_minutes


class TestDurationParser(unittest.TestCase):
    def test_plain_minutes(self):
        self.assertEqual(_to_minutes("30"), 30)
        self.assertEqual(_to_minutes("  45  "), 45)

    def test_minutes_with_label(self):
        self.assertEqual(_to_minutes("30 min"), 30)
        self.assertEqual(_to_minutes("15 mins"), 15)
        self.assertEqual(_to_minutes("10 minutes"), 10)

    def test_hours(self):
        self.assertEqual(_to_minutes("1 hour"), 60)
        self.assertEqual(_to_minutes("2 hours"), 120)
        self.assertEqual(_to_minutes("3 hr"), 180)

    def test_hour_minute_format(self):
        self.assertEqual(_to_minutes("1:30"), 90)
        self.assertEqual(_to_minutes("0:45"), 45)
        self.assertEqual(_to_minutes("2:00"), 120)

    def test_invalid_inputs_raise(self):
        with self.assertRaises(ValueError):
            _to_minutes("")
        with self.assertRaises(ValueError):
            _to_minutes("twenty")
        with self.assertRaises(ValueError):
            _to_minutes("1 banana")


if __name__ == "__main__":
    unittest.main() 
