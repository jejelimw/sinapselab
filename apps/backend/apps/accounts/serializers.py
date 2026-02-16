from dj_rest_auth.registration.serializers import RegisterSerializer
from rest_framework import serializers

from .models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "full_name", "phone", "role", "locale"]


class ClientRegisterSerializer(RegisterSerializer):
    full_name = serializers.CharField(max_length=180)
    phone = serializers.CharField(max_length=32)

    def get_cleaned_data(self):
        data = super().get_cleaned_data()
        data["full_name"] = self.validated_data.get("full_name", "")
        data["phone"] = self.validated_data.get("phone", "")
        return data

    def save(self, request):
        user = super().save(request)
        user.full_name = self.validated_data["full_name"]
        user.phone = self.validated_data["phone"]
        user.role = "cliente"
        user.save(update_fields=["full_name", "phone", "role"])
        return user
