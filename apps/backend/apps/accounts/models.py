from django.contrib.auth.models import AbstractUser
from django.db import models


class UserRole(models.TextChoices):
    CLIENTE = "cliente", "Cliente"
    LAB_ATENDENTE = "lab_atendente", "Lab Atendente"
    LAB_ANALISTA = "lab_analista", "Lab Analista"
    LAB_SUPERVISOR = "lab_supervisor", "Lab Supervisor"
    LAB_ADMIN = "lab_admin", "Lab Admin"


class User(AbstractUser):
    username = None
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=180)
    phone = models.CharField(max_length=32, blank=True)
    role = models.CharField(max_length=32, choices=UserRole.choices, default=UserRole.CLIENTE)
    locale = models.CharField(max_length=12, default="pt-BR")

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    def __str__(self) -> str:
        return f"{self.email} ({self.role})"
