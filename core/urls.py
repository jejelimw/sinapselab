from django.urls import path
from . import views

app_name = 'core'

urlpatterns = [
    path('', views.login_view, name='login'),
    path('login/', views.login_view, name='login'),
    path('register/', views.register_view, name='register'),
    path('logout/', views.logout_view, name='logout'),
    path('dashboard/', views.dashboard_view, name='dashboard'),
    path('password-reset/', views.password_reset_request_view, name='password_reset'),
    
    # Service Requests
    path('solicitacoes/', views.service_request_list, name='service_request_list'),
    path('solicitacoes/nova/', views.service_request_create, name='service_request_create'),
    path('solicitacoes/<int:pk>/', views.service_request_detail, name='service_request_detail'),
]
