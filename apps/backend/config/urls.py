from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("apps.accounts.urls")),
    path("api/solicitacoes/", include("apps.solicitacoes.urls")),
    path("api/laboratorio/solicitacoes/", include("apps.solicitacoes.lab_urls")),
    path("api/notificacoes/", include("apps.notifications.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
