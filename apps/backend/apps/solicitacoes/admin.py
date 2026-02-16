from django.contrib import admin

from .models import Solicitacao, SolicitacaoAnexo


class SolicitacaoAnexoInline(admin.TabularInline):
    model = SolicitacaoAnexo
    extra = 0


@admin.register(Solicitacao)
class SolicitacaoAdmin(admin.ModelAdmin):
    list_display = ("id", "titulo", "cliente", "status", "created_at", "responded_at")
    list_filter = ("status", "created_at")
    search_fields = ("titulo", "cliente__email")
    inlines = [SolicitacaoAnexoInline]
