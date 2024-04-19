from rest_framework import permissions

class RecieptOwner(permissions.IsAuthenticated):
    def has_object_permission(self, request, view, reciept):
        return super().has_permission(request, view) and request.user == reciept.user
