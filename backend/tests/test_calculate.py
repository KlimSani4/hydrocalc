import pytest


class TestCalculate:
    """Тесты расчёта потребления воды."""

    def test_calculate_basic(self, client):
        """Базовый расчёт без коэффициентов."""
        response = client.post(
            "/api/v1/calculate",
            json={
                "junior_count": 10,
                "middle_count": 0,
                "senior_count": 0,
                "staff_count": 0,
                "season": "cold",
                "activity": "normal"
            }
        )

        assert response.status_code == 200
        data = response.json()
        # 10 * 1.6 * 1.0 * 1.0 = 16.0
        assert data["total_water"] == 16.0
        assert data["total_people"] == 10

    def test_calculate_all_categories(self, client):
        """Расчёт со всеми категориями."""
        response = client.post(
            "/api/v1/calculate",
            json={
                "junior_count": 10,
                "middle_count": 10,
                "senior_count": 10,
                "staff_count": 5,
                "season": "cold",
                "activity": "normal"
            }
        )

        assert response.status_code == 200
        data = response.json()
        # (10*1.6 + 10*1.85 + 10*2.15 + 5*2.25) * 1.0 * 1.0 = 67.25
        assert data["total_water"] == 67.25
        assert data["total_people"] == 35

    def test_calculate_with_season_coefficient(self, client):
        """Расчёт с коэффициентом сезона."""
        response = client.post(
            "/api/v1/calculate",
            json={
                "junior_count": 10,
                "middle_count": 0,
                "senior_count": 0,
                "staff_count": 0,
                "season": "warm",
                "activity": "normal"
            }
        )

        assert response.status_code == 200
        data = response.json()
        # 10 * 1.6 * 1.3 * 1.0 = 20.8
        assert data["total_water"] == 20.8
        assert data["coefficients"]["season"] == 1.3

    def test_calculate_with_activity_coefficient(self, client):
        """Расчёт с коэффициентом активности."""
        response = client.post(
            "/api/v1/calculate",
            json={
                "junior_count": 10,
                "middle_count": 0,
                "senior_count": 0,
                "staff_count": 0,
                "season": "cold",
                "activity": "sport"
            }
        )

        assert response.status_code == 200
        data = response.json()
        # 10 * 1.6 * 1.0 * 1.5 = 24.0
        assert data["total_water"] == 24.0
        assert data["coefficients"]["activity"] == 1.5

    def test_calculate_trip_activity(self, client):
        """Расчёт для похода."""
        response = client.post(
            "/api/v1/calculate",
            json={
                "junior_count": 5,
                "middle_count": 5,
                "senior_count": 0,
                "staff_count": 2,
                "season": "warm",
                "activity": "trip"
            }
        )

        assert response.status_code == 200
        data = response.json()
        # (5*1.6 + 5*1.85 + 2*2.25) * 1.3 * 2.0 = 56.29
        base = 5*1.6 + 5*1.85 + 2*2.25
        expected = round(base * 1.3 * 2.0, 2)
        assert data["total_water"] == expected
        assert data["coefficients"]["activity"] == 2.0

    def test_calculate_breakdown(self, client):
        """Проверка детализации по категориям."""
        response = client.post(
            "/api/v1/calculate",
            json={
                "junior_count": 5,
                "middle_count": 3,
                "senior_count": 2,
                "staff_count": 1,
                "season": "cold",
                "activity": "normal"
            }
        )

        assert response.status_code == 200
        data = response.json()
        breakdown = data["breakdown"]

        assert breakdown["junior"]["count"] == 5
        assert breakdown["junior"]["norm"] == 1.6
        assert breakdown["junior"]["subtotal"] == 8.0

        assert breakdown["middle"]["count"] == 3
        assert breakdown["middle"]["norm"] == 1.85
        assert breakdown["middle"]["subtotal"] == 5.55

    def test_calculate_invalid_season(self, client):
        """Ошибка при невалидном сезоне."""
        response = client.post(
            "/api/v1/calculate",
            json={
                "junior_count": 10,
                "middle_count": 0,
                "senior_count": 0,
                "staff_count": 0,
                "season": "summer",  # Невалидное значение
                "activity": "normal"
            }
        )

        assert response.status_code == 422

    def test_calculate_saves_for_authenticated_user(self, client, auth_headers):
        """Расчёт сохраняется для авторизованного пользователя."""
        response = client.post(
            "/api/v1/calculate",
            json={
                "junior_count": 10,
                "middle_count": 0,
                "senior_count": 0,
                "staff_count": 0,
                "season": "cold",
                "activity": "normal"
            },
            headers=auth_headers
        )

        assert response.status_code == 200

        # Проверяем что расчёт сохранился в истории
        history_response = client.get(
            "/api/v1/history",
            headers=auth_headers
        )
        assert len(history_response.json()) == 1


class TestHistory:
    """Тесты истории расчётов."""

    def test_history_requires_auth(self, client):
        """История требует авторизации."""
        response = client.get("/api/v1/history")
        assert response.status_code == 401

    def test_history_empty(self, client, auth_headers):
        """Пустая история для нового пользователя."""
        response = client.get(
            "/api/v1/history",
            headers=auth_headers
        )

        assert response.status_code == 200
        assert response.json() == []

    def test_history_with_calculations(self, client, auth_headers):
        """История с расчётами."""
        # Создаём два расчёта
        client.post(
            "/api/v1/calculate",
            json={
                "junior_count": 10,
                "middle_count": 0,
                "senior_count": 0,
                "staff_count": 0,
                "season": "cold",
                "activity": "normal"
            },
            headers=auth_headers
        )

        client.post(
            "/api/v1/calculate",
            json={
                "junior_count": 5,
                "middle_count": 5,
                "senior_count": 0,
                "staff_count": 0,
                "season": "warm",
                "activity": "sport"
            },
            headers=auth_headers
        )

        response = client.get(
            "/api/v1/history",
            headers=auth_headers
        )

        assert response.status_code == 200
        data = response.json()
        assert len(data) == 2

    def test_history_detail(self, client, auth_headers):
        """Детальная информация о расчёте."""
        # Создаём расчёт
        calc_response = client.post(
            "/api/v1/calculate",
            json={
                "junior_count": 10,
                "middle_count": 5,
                "senior_count": 0,
                "staff_count": 2,
                "season": "warm",
                "activity": "normal"
            },
            headers=auth_headers
        )

        # Получаем историю
        history = client.get(
            "/api/v1/history",
            headers=auth_headers
        ).json()

        calc_id = history[0]["id"]

        # Получаем детали
        response = client.get(
            f"/api/v1/history/{calc_id}",
            headers=auth_headers
        )

        assert response.status_code == 200
        data = response.json()
        assert "breakdown" in data
        assert "coefficients" in data
        assert data["coefficients"]["season"] == 1.3

    def test_history_detail_not_found(self, client, auth_headers):
        """Расчёт не найден."""
        response = client.get(
            "/api/v1/history/9999",
            headers=auth_headers
        )

        assert response.status_code == 404
