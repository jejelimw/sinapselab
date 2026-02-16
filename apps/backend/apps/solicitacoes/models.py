import os

from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models


def attachment_upload_to(instance, filename):
    return f"solicitacoes/{instance.solicitacao_id}/{filename}"


def validate_attachment(value):
    max_size = settings.MAX_UPLOAD_SIZE_BYTES
    if value.size > max_size:
        raise ValidationError("Arquivo excede o limite de 20MB.")

    _, extension = os.path.splitext(value.name)
    extension = extension.lower().replace(".", "")
    if extension not in settings.ALLOWED_UPLOAD_EXTENSIONS:
        raise ValidationError("Tipo de arquivo nao permitido.")


class SolicitacaoStatus(models.TextChoices):
    ENVIADA = "enviada", "Enviada"
    EM_ANALISE = "em_analise", "Em analise"
    AGUARDANDO_DADOS = "aguardando_dados", "Aguardando dados"
    RESPONDIDA = "respondida", "Respondida"
    RECUSADA = "recusada", "Recusada"
    REABERTA = "reaberta", "Reaberta"


class Solicitacao(models.Model):
    cliente = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="solicitacoes")
    titulo = models.CharField(max_length=255)
    descricao = models.TextField()
    status = models.CharField(max_length=32, choices=SolicitacaoStatus.choices, default=SolicitacaoStatus.ENVIADA)
    resposta_laboratorio = models.TextField(blank=True)
    responded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="solicitacoes_respondidas",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    responded_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"#{self.pk} - {self.titulo}"


class SolicitacaoAnexo(models.Model):
    solicitacao = models.ForeignKey(Solicitacao, on_delete=models.CASCADE, related_name="anexos")
    arquivo = models.FileField(upload_to=attachment_upload_to, validators=[validate_attachment])
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"Anexo {self.pk} ({self.arquivo.name})"
