from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
import uuid


class ServiceRequest(models.Model):
    """Model para solicitações de serviço ao laboratório"""
    
    # Choices para tipo de material
    MATERIAL_TYPE_CHOICES = [
        ('crina', 'Crina'),
        ('unha', 'Unha'),
        ('crina_arquiva', 'Crina para arquiva'),
        ('crina_unha', 'Crina + unha'),
        ('placo_tricroscopico', 'Plaço tricroscópico'),
    ]
    
    # Choices para categoria de material
    MATERIAL_CATEGORY_CHOICES = [
        ('analise', 'Análise'),
        ('zootecnia', 'Zootecnia'),
        ('equus', 'Equus'),
        ('outro', 'Outro'),
    ]
    
    # Choices para status
    STATUS_CHOICES = [
        ('pendente', 'Pendente'),
        ('em_analise', 'Em Análise'),
        ('concluida', 'Concluída'),
        ('cancelada', 'Cancelada'),
    ]
    
    # Choices para quantidade (B-1 a B-8 e 1 a 30)
    QUANTITY_CHOICES = [(f'b{i}', f'B-{i}') for i in range(1, 9)] + \
                       [(str(i), str(i)) for i in range(1, 31)] + \
                       [('outro', 'Outro')]
    
    # Campos principais
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='service_requests',
                            verbose_name='Usuário')
    protocol_number = models.CharField(max_length=20, unique=True, editable=False,
                                      verbose_name='Número de Protocolo')
    
    # Dados do formulário
    patient_name = models.CharField(max_length=200, verbose_name='Nome do Paciente')
    material_type = models.CharField(max_length=50, choices=MATERIAL_TYPE_CHOICES,
                                    verbose_name='Tipo de Material')
    exams = models.TextField(verbose_name='Quais Exames?')
    material_category = models.CharField(max_length=50, choices=MATERIAL_CATEGORY_CHOICES,
                                        verbose_name='Qual Material?')
    quantity = models.CharField(max_length=20, choices=QUANTITY_CHOICES,
                               verbose_name='Quantidade')
    shipping_instructions = models.TextField(verbose_name='Envio (Instruções)',
                                            blank=True, null=True)
    contact_email = models.EmailField(verbose_name='Endereço de E-mail')
    observations = models.TextField(verbose_name='Observações', blank=True, null=True)
    
    # Controle
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, 
                             default='pendente', verbose_name='Status')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Criado em')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Atualizado em')
    
    class Meta:
        verbose_name = 'Solicitação de Serviço'
        verbose_name_plural = 'Solicitações de Serviço'
        ordering = ['-created_at']
    
    def __str__(self):
        return f'{self.protocol_number} - {self.patient_name}'
    
    def save(self, *args, **kwargs):
        """Gera número de protocolo único antes de salvar"""
        if not self.protocol_number:
            # Formato: SL-YYYYMMDD-XXXX (SL = Sinapse Lab)
            date_str = timezone.now().strftime('%Y%m%d')
            random_str = str(uuid.uuid4().hex[:4].upper())
            self.protocol_number = f'SL-{date_str}-{random_str}'
        super().save(*args, **kwargs)
    
    def get_status_display_color(self):
        """Retorna cor para o status"""
        colors = {
            'pendente': '#f59e0b',  # orange
            'em_analise': '#3b82f6',  # blue
            'concluida': '#10b981',  # green
            'cancelada': '#ef4444',  # red
        }
        return colors.get(self.status, '#6b7280')
