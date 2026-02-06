from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.urls import reverse
from .forms import LoginForm, RegisterForm, PasswordResetRequestForm, ServiceRequestForm
from .models import ServiceRequest
from datetime import datetime


def login_view(request):
    """View de login"""
    if request.user.is_authenticated:
        return redirect('core:dashboard')
    
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            user = form.cleaned_data['user']
            login(request, user, backend='django.contrib.auth.backends.ModelBackend')
            messages.success(request, f'Bem-vindo de volta, {user.first_name or user.username}!')
            next_url = request.GET.get('next', 'core:dashboard')
            return redirect(next_url)
    else:
        form = LoginForm()
    
    return render(request, 'core/login.html', {'form': form})


def register_view(request):
    """View de registro de novo usuário"""
    if request.user.is_authenticated:
        return redirect('core:dashboard')
    
    if request.method == 'POST':
        form = RegisterForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user, backend='django.contrib.auth.backends.ModelBackend')
            messages.success(request, f'Conta criada com sucesso! Bem-vindo, {user.first_name}!')
            return redirect('core:dashboard')
    else:
        form = RegisterForm()
    
    return render(request, 'core/register.html', {'form': form})


def logout_view(request):
    """View de logout"""
    logout(request)
    messages.info(request, 'Você saiu da sua conta.')
    return redirect('core:login')


@login_required
def dashboard_view(request):
    """Dashboard principal após login"""
    # Obter estatísticas de solicitações
    user_requests = ServiceRequest.objects.filter(user=request.user)
    
    context = {
        'user': request.user,
        'total_requests': user_requests.count(),
        'pending_requests': user_requests.filter(status='pendente').count(),
        'recent_requests': user_requests[:5],  # 5 mais recentes
    }
    return render(request, 'core/dashboard.html', context)


def password_reset_request_view(request):
    """View para solicitar recuperação de senha"""
    if request.method == 'POST':
        form = PasswordResetRequestForm(request.POST)
        if form.is_valid():
            email = form.cleaned_data['email']
            # TODO: Implementar envio de email
            # Por enquanto, apenas mostrar mensagem de sucesso
            messages.success(
                request,
                'Instruções para redefinir sua senha foram enviadas para seu email.'
            )
            return redirect('core:login')
    else:
        form = PasswordResetRequestForm()
    
    return render(request, 'core/password_reset.html', {'form': form})


@login_required
def service_request_list(request):
    """Lista de solicitações de serviço do usuário com filtro por mês"""
    # Pegar mês selecionado do filtro (ou mês atual)
    selected_month = request.GET.get('month', datetime.now().strftime('%Y-%m'))
    
    # Filtrar solicitações do usuário
    requests = ServiceRequest.objects.filter(user=request.user)
    
    # Filtrar por mês se selecionado
    if selected_month:
        try:
            year, month = selected_month.split('-')
            requests = requests.filter(
                created_at__year=year,
                created_at__month=month
            )
        except ValueError:
            pass  # Ignorar se formato inválido
    
    # Obter meses disponíveis para o filtro
    all_requests = ServiceRequest.objects.filter(user=request.user)
    available_months = all_requests.datetimes('created_at', 'month', order='DESC')
    
    context = {
        'requests': requests,
        'selected_month': selected_month,
        'available_months': available_months,
        'total_requests': all_requests.count(),
    }
    return render(request, 'core/service_request_list.html', context)


@login_required
def service_request_create(request):
    """Criar nova solicitação de serviço"""
    if request.method == 'POST':
        form = ServiceRequestForm(request.POST)
        if form.is_valid():
            service_request = form.save(commit=False)
            service_request.user = request.user
            service_request.save()
            messages.success(
                request,
                f'Solicitação criada com sucesso! Protocolo: {service_request.protocol_number}'
            )
            return redirect('core:service_request_detail', pk=service_request.pk)
    else:
        # Preencher email do usuário automaticamente
        initial_data = {'contact_email': request.user.email}
        form = ServiceRequestForm(initial=initial_data)
    
    context = {'form': form}
    return render(request, 'core/service_request_form.html', context)


@login_required
def service_request_detail(request, pk):
    """Detalhes de uma solicitação de serviço"""
    service_request = get_object_or_404(ServiceRequest, pk=pk, user=request.user)
    context = {'request_obj': service_request}
    return render(request, 'core/service_request_detail.html', context)
