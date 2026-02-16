from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import DeviceToken
from .serializers import DeviceTokenSerializer


class RegisterDeviceTokenView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = DeviceTokenSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        payload = serializer.validated_data

        token, _ = DeviceToken.objects.update_or_create(
            token=payload["token"],
            defaults={
                "user": request.user,
                "platform": payload["platform"],
                "locale": payload.get("locale", "pt-BR"),
                "active": payload.get("active", True),
            },
        )
        return Response(DeviceTokenSerializer(token).data, status=status.HTTP_201_CREATED)
