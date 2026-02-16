from rest_framework.routers import DefaultRouter

from .views import LaboratorioSolicitacaoViewSet

router = DefaultRouter()
router.register(r"", LaboratorioSolicitacaoViewSet, basename="laboratorio-solicitacoes")

urlpatterns = router.urls
