import pytest


class TestRegister:
    """Тесты регистрации пользователя."""

    def test_register_success(self, client):
        """Успешная регистрация нового пользователя."""
        response = client.post(
            "/api/v1/auth/register",
            json={"email": "user@example.com", "password": "password123"}
        )

        assert response.status_code == 201
        data = response.json()
        assert data["email"] == "user@example.com"
        assert "id" in data
        assert "created_at" in data

    def test_register_duplicate_email(self, client):
        """Ошибка при регистрации с существующим email."""
        client.post(
            "/api/v1/auth/register",
            json={"email": "user@example.com", "password": "password123"}
        )

        response = client.post(
            "/api/v1/auth/register",
            json={"email": "user@example.com", "password": "another123"}
        )

        assert response.status_code == 400
        assert "уже существует" in response.json()["detail"]

    def test_register_invalid_email(self, client):
        """Ошибка при невалидном email."""
        response = client.post(
            "/api/v1/auth/register",
            json={"email": "not-an-email", "password": "password123"}
        )

        assert response.status_code == 422


class TestLogin:
    """Тесты входа в систему."""

    def test_login_success(self, client):
        """Успешный вход."""
        client.post(
            "/api/v1/auth/register",
            json={"email": "user@example.com", "password": "password123"}
        )

        response = client.post(
            "/api/v1/auth/login",
            data={"username": "user@example.com", "password": "password123"}
        )

        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"

    def test_login_wrong_password(self, client):
        """Ошибка при неверном пароле."""
        client.post(
            "/api/v1/auth/register",
            json={"email": "user@example.com", "password": "password123"}
        )

        response = client.post(
            "/api/v1/auth/login",
            data={"username": "user@example.com", "password": "wrongpass"}
        )

        assert response.status_code == 401

    def test_login_nonexistent_user(self, client):
        """Ошибка при несуществующем пользователе."""
        response = client.post(
            "/api/v1/auth/login",
            data={"username": "nobody@example.com", "password": "password123"}
        )

        assert response.status_code == 401
