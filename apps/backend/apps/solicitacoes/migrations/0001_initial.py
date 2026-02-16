import apps.solicitacoes.models
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Solicitacao",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("titulo", models.CharField(max_length=255)),
                ("descricao", models.TextField()),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("enviada", "Enviada"),
                            ("em_analise", "Em analise"),
                            ("aguardando_dados", "Aguardando dados"),
                            ("respondida", "Respondida"),
                            ("recusada", "Recusada"),
                            ("reaberta", "Reaberta"),
                        ],
                        default="enviada",
                        max_length=32,
                    ),
                ),
                ("resposta_laboratorio", models.TextField(blank=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("responded_at", models.DateTimeField(blank=True, null=True)),
                (
                    "cliente",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="solicitacoes",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
                (
                    "responded_by",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="solicitacoes_respondidas",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={"ordering": ["-created_at"]},
        ),
        migrations.CreateModel(
            name="SolicitacaoAnexo",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                (
                    "arquivo",
                    models.FileField(
                        upload_to=apps.solicitacoes.models.attachment_upload_to,
                        validators=[apps.solicitacoes.models.validate_attachment],
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                (
                    "solicitacao",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="anexos",
                        to="solicitacoes.solicitacao",
                    ),
                ),
                (
                    "uploaded_by",
                    models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
                ),
            ],
        ),
    ]
