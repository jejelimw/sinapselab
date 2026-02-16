from rest_framework.permissions import BasePermission

LAB_ROLES = {"lab_atendente", "lab_analista", "lab_supervisor", "lab_admin"}
LAB_RESPONDER_ROLES = {"lab_analista", "lab_supervisor", "lab_admin"}


class IsLabUser(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in LAB_ROLES


class CanRespondSolicitacao(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in LAB_RESPONDER_ROLES
