from django import forms
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import ServiceRequest
from django.core.exceptions import ValidationError


class LoginForm(forms.Form):
    """Formulário de login com email e senha"""
    email = forms.EmailField(
        max_length=254,
        widget=forms.EmailInput(attrs={
            'placeholder': 'matheus.costa@lab.com.br',
            'class': 'form-input input-orange',
        })
    )
    password = forms.CharField(
        widget=forms.PasswordInput(attrs={
            'placeholder': '••••••',
            'class': 'form-input input-blue',
        })
    )

    def clean(self):
        cleaned_data = super().clean()
        email = cleaned_data.get('email')
        password = cleaned_data.get('password')

        if email and password:
            # Encontrar usuário pelo email
            try:
                user = User.objects.get(email=email)
                # Autenticar com username
                user = authenticate(username=user.username, password=password)
                if user is None:
                    raise ValidationError('Email ou senha incorretos.')
                if not user.is_active:
                    raise ValidationError('Esta conta está inativa.')
                cleaned_data['user'] = user
            except User.DoesNotExist:
                raise ValidationError('Email ou senha incorretos.')
        
        return cleaned_data


class RegisterForm(forms.ModelForm):
    """Formulário de registro de novo usuário"""
    password = forms.CharField(
        label='Senha',
        widget=forms.PasswordInput(attrs={
            'placeholder': '••••••',
            'class': 'form-input'
        })
    )
    password_confirm = forms.CharField(
        label='Confirmar Senha',
        widget=forms.PasswordInput(attrs={
            'placeholder': '••••••',
            'class': 'form-input'
        })
    )

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'username']
        widgets = {
            'first_name': forms.TextInput(attrs={
                'placeholder': 'Nome',
                'class': 'w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-300'
            }),
            'last_name': forms.TextInput(attrs={
                'placeholder': 'Sobrenome',
                'class': 'w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-300'
            }),
            'email': forms.EmailInput(attrs={
                'placeholder': 'seu@email.com',
                'class': 'w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-300'
            }),
            'username': forms.TextInput(attrs={
                'placeholder': 'Nome de usuário',
                'class': 'w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-300'
            }),
        }

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if User.objects.filter(email=email).exists():
            raise ValidationError('Este email já está cadastrado.')
        return email

    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get('password')
        password_confirm = cleaned_data.get('password_confirm')

        if password and password_confirm and password != password_confirm:
            raise ValidationError('As senhas não coincidem.')

        return cleaned_data

    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data['password'])
        if commit:
            user.save()
        return user


class PasswordResetRequestForm(forms.Form):
    """Formulário para solicitar recuperação de senha"""
    email = forms.EmailField(
        max_length=254,
        widget=forms.EmailInput(attrs={
            'placeholder': 'seu@email.com',
            'class': 'form-input'
        })
    )

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if not User.objects.filter(email=email).exists():
            raise ValidationError('Não encontramos nenhuma conta com este email.')
        return email


class ServiceRequestForm(forms.ModelForm):
    """Formulário para solicitação de serviço ao laboratório"""
    
    class Meta:
        model = ServiceRequest
        fields = [
            'patient_name',
            'material_type',
            'exams',
            'material_category',
            'quantity',
            'shipping_instructions',
            'contact_email',
            'observations'
        ]
        widgets = {
            'patient_name': forms.TextInput(attrs={
                'class': 'form-input',
                'placeholder': 'Nome completo do paciente',
            }),
            'material_type': forms.RadioSelect(attrs={
                'class': 'form-radio',
            }),
            'exams': forms.Textarea(attrs={
                'class': 'form-input',
                'placeholder': 'Descreva os exames solicitados...',
                'rows': 3,
            }),
            'material_category': forms.RadioSelect(attrs={
                'class': 'form-radio',
            }),
            'quantity': forms.Select(attrs={
                'class': 'form-input',
            }),
            'shipping_instructions': forms.Textarea(attrs={
                'class': 'form-input',
                'placeholder': 'Instruções para envio do material...',
                'rows': 3,
            }),
            'contact_email': forms.EmailInput(attrs={
                'class': 'form-input',
                'placeholder': 'seu@email.com',
            }),
            'observations': forms.Textarea(attrs={
                'class': 'form-input',
                'placeholder': 'Observações adicionais (opcional)...',
                'rows': 3,
            }),
        }
        labels = {
            'patient_name': 'Nome do Paciente *',
            'material_type': 'Qual tipo de material? *',
            'exams': 'Quais exames? *',
            'material_category': 'Qual material? *',
            'quantity': 'Quantidade *',
            'shipping_instructions': 'Envio',
            'contact_email': 'Endereço de E-mail *',
            'observations': 'Observações',
        }
