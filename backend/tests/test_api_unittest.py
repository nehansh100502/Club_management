import unittest
from app import create_app
from app.extensions import db
from app.models import User, Club, Event, ClubMember


class TestConfig:
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = "test-secret"
    JWT_SECRET_KEY = "test-jwt-secret"
    CORS_ORIGINS = ["http://localhost:5173"]


class APITestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app(TestConfig)
        self.client = self.app.test_client()
        self.ctx = self.app.app_context()
        self.ctx.push()
        db.create_all()
        from app.seed import seed_database
        seed_database(force=True)

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.ctx.pop()

    def test_health_check(self):
        res = self.client.get("/api/health")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.get_json()["status"], "ok")

    def test_auth_and_rbac_flow(self):
        # 1. Login with seeded admin
        admin_login = self.client.post(
            "/api/auth/login",
            json={"email": "admin@university.edu", "password": "password"},
        )
        self.assertEqual(admin_login.status_code, 200)
        admin_data = admin_login.get_json()
        admin_token = admin_data["token"]
        self.assertEqual(admin_data["user"]["role"], "admin")

        # 2. Login with seeded club head
        head_login = self.client.post(
            "/api/auth/login",
            json={"email": "head@university.edu", "password": "password"},
        )
        self.assertEqual(head_login.status_code, 200)
        head_data = head_login.get_json()
        head_token = head_data["token"]
        self.assertEqual(head_data["user"]["role"], "club_head")

        # 3. Login with student
        student_login = self.client.post(
            "/api/auth/login",
            json={"email": "student@university.edu", "password": "password"},
        )
        self.assertEqual(student_login.status_code, 200)
        student_data = student_login.get_json()
        student_token = student_data["token"]
        self.assertEqual(student_data["user"]["role"], "student")

        # 4. Student joins a club
        join_res = self.client.post(
            "/api/clubs/club-music/join",
            headers={"Authorization": f"Bearer {student_token}"},
        )
        self.assertIn(join_res.status_code, [200, 400])

        # 5. Club head creates an event (status should be 'pending')
        create_ev_res = self.client.post(
            "/api/events",
            headers={"Authorization": f"Bearer {head_token}"},
            json={
                "title": "Automated Test Workshop",
                "description": "Learning software testing and backend API design",
                "date": "2026-09-15",
                "time": "14:00",
                "location": "Room 401",
                "clubId": "club-tech",
            },
        )
        self.assertEqual(create_ev_res.status_code, 201)
        ev_data = create_ev_res.get_json()
        self.assertEqual(ev_data["status"], "pending")
        event_id = ev_data["id"]

        # 6. Student cannot approve event (RBAC check)
        student_approve_res = self.client.post(
            f"/api/events/{event_id}/approve",
            headers={"Authorization": f"Bearer {student_token}"},
        )
        self.assertEqual(student_approve_res.status_code, 403)

        # 7. Admin approves event
        admin_approve_res = self.client.post(
            f"/api/events/{event_id}/approve",
            headers={"Authorization": f"Bearer {admin_token}"},
        )
        self.assertEqual(admin_approve_res.status_code, 200)
        self.assertEqual(admin_approve_res.get_json()["status"], "approved")

        # 8. List clubs
        clubs_res = self.client.get("/api/clubs")
        self.assertEqual(clubs_res.status_code, 200)
        self.assertGreaterEqual(len(clubs_res.get_json()), 1)


if __name__ == "__main__":
    unittest.main()
