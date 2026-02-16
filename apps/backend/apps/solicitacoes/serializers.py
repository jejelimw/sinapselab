from django.conf import settings
from rest_framework import serializers

from .models import Solicitacao, SolicitacaoAnexo


class SolicitacaoAnexoSerializer(serializers.ModelSerializer):
    class Meta:
        model = SolicitacaoAnexo
        fields = ["id", "arquivo", "uploaded_by", "created_at"]
        read_only_fields = ["id", "uploaded_by", "created_at"]


class SolicitacaoSerializer(serializers.ModelSerializer):
    anexos = SolicitacaoAnexoSerializer(many=True, read_only=True)

    class Meta:
        model = Solicitacao
        fields = [
            "id",
            "cliente",
            "titulo",
            "descricao",
            "status",
            "resposta_laboratorio",
            "responded_by",
            "created_at",
            "updated_at",
            "responded_at",
            "anexos",
        ]
        read_only_fields = [
            "id",
            "cliente",
            "resposta_laboratorio",
            "responded_by",
            "created_at",
            "updated_at",
            "responded_at",
            "anexos",
        ]


class SolicitacaoRespostaSerializer(serializers.Serializer):
    resposta_laboratorio = serializers.CharField()
    status = serializers.ChoiceField(choices=["respondida", "recusada", "em_analise"])


class SolicitacaoStatusSerializer(serializers.Serializer):
    status = serializers.ChoiceField(
        choices=["em_analise", "aguardando_dados", "reaberta", "respondida", "recusada"]
    )


class SolicitacaoAnexoCreateSerializer(serializers.ModelSerializer):
    def validate_arquivo(self, value):
        content_type = getattr(value, "content_type", "")
        if content_type and content_type not in settings.ALLOWED_UPLOAD_MIME_TYPES:
            raise serializers.ValidationError("MIME type nao permitido.")
        return value

    class Meta:
        model = SolicitacaoAnexo
        fields = ["id", "arquivo", "created_at"]
        read_only_fields = ["id", "created_at"]
