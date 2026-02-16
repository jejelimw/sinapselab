from django.utils import timezone
from django_filters import rest_framework as filters
from rest_framework import mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.common.permissions import CanRespondSolicitacao, IsLabUser

from .models import Solicitacao
from .serializers import (
    SolicitacaoAnexoCreateSerializer,
    SolicitacaoAnexoSerializer,
    SolicitacaoRespostaSerializer,
    SolicitacaoSerializer,
    SolicitacaoStatusSerializer,
)


class SolicitacaoFilter(filters.FilterSet):
    start_date = filters.DateFilter(field_name="created_at__date", lookup_expr="gte")
    end_date = filters.DateFilter(field_name="created_at__date", lookup_expr="lte")

    class Meta:
        model = Solicitacao
        fields = ["status", "start_date", "end_date"]


class SolicitacaoViewSet(viewsets.ModelViewSet):
    serializer_class = SolicitacaoSerializer
    permission_classes = [IsAuthenticated]
    filterset_class = SolicitacaoFilter
    ordering_fields = ["created_at", "updated_at"]
    search_fields = ["titulo", "descricao"]

    def get_queryset(self):
        user = self.request.user
        queryset = Solicitacao.objects.select_related("cliente", "responded_by").prefetch_related("anexos")
        if user.role == "cliente":
            return queryset.filter(cliente=user)
        return queryset.none()

    def create(self, request, *args, **kwargs):
        if request.user.role != "cliente":
            return Response({"detail": "Apenas clientes podem criar solicitacoes."}, status=status.HTTP_403_FORBIDDEN)
        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(cliente=self.request.user)

    @action(
        detail=True,
        methods=["post"],
        url_path="anexos",
        permission_classes=[IsAuthenticated],
        parser_classes=[MultiPartParser, FormParser],
    )
    def upload_anexo(self, request, pk=None):
        solicitacao = self.get_object()
        if request.user.role == "cliente" and solicitacao.cliente_id != request.user.id:
            return Response({"detail": "Sem permissao para anexar neste item."}, status=status.HTTP_403_FORBIDDEN)

        serializer = SolicitacaoAnexoCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        anexo = serializer.save(solicitacao=solicitacao, uploaded_by=request.user)
        return Response(SolicitacaoAnexoSerializer(anexo).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["patch"], permission_classes=[IsLabUser], url_path="status")
    def update_status(self, request, pk=None):
        solicitacao = self.get_object()
        serializer = SolicitacaoStatusSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        solicitacao.status = serializer.validated_data["status"]
        if solicitacao.status in {"respondida", "recusada"}:
            solicitacao.responded_by = request.user
            solicitacao.responded_at = timezone.now()
        solicitacao.save(update_fields=["status", "responded_by", "responded_at", "updated_at"])
        return Response(SolicitacaoSerializer(solicitacao).data)

    @action(detail=True, methods=["post"], permission_classes=[CanRespondSolicitacao], url_path="responder")
    def responder(self, request, pk=None):
        solicitacao = self.get_object()
        serializer = SolicitacaoRespostaSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        solicitacao.resposta_laboratorio = serializer.validated_data["resposta_laboratorio"]
        solicitacao.status = serializer.validated_data["status"]
        solicitacao.responded_by = request.user
        solicitacao.responded_at = timezone.now()
        solicitacao.save(
            update_fields=["resposta_laboratorio", "status", "responded_by", "responded_at", "updated_at"]
        )
        return Response(SolicitacaoSerializer(solicitacao).data)


class LaboratorioSolicitacaoViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet,
):
    serializer_class = SolicitacaoSerializer
    permission_classes = [IsLabUser]
    filterset_class = SolicitacaoFilter
    ordering_fields = ["created_at", "updated_at"]
    search_fields = ["titulo", "descricao", "cliente__email"]

    def get_queryset(self):
        return Solicitacao.objects.select_related("cliente", "responded_by").prefetch_related("anexos")

    @action(detail=True, methods=["patch"], permission_classes=[IsLabUser], url_path="status")
    def update_status(self, request, pk=None):
        solicitacao = self.get_object()
        serializer = SolicitacaoStatusSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        solicitacao.status = serializer.validated_data["status"]
        if solicitacao.status in {"respondida", "recusada"}:
            solicitacao.responded_by = request.user
            solicitacao.responded_at = timezone.now()
        solicitacao.save(update_fields=["status", "responded_by", "responded_at", "updated_at"])
        return Response(SolicitacaoSerializer(solicitacao).data)

    @action(detail=True, methods=["post"], permission_classes=[CanRespondSolicitacao], url_path="responder")
    def responder(self, request, pk=None):
        solicitacao = self.get_object()
        serializer = SolicitacaoRespostaSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        solicitacao.resposta_laboratorio = serializer.validated_data["resposta_laboratorio"]
        solicitacao.status = serializer.validated_data["status"]
        solicitacao.responded_by = request.user
        solicitacao.responded_at = timezone.now()
        solicitacao.save(
            update_fields=["resposta_laboratorio", "status", "responded_by", "responded_at", "updated_at"]
        )
        return Response(SolicitacaoSerializer(solicitacao).data)
