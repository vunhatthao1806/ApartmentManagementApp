from rest_framework import permissions

class RecieptOwner(permissions.IsAuthenticated):
    def has_object_permission(self, request, view, reciept):
        return super().has_permission(request, view) and request.user == reciept.user

class CommentOwner(permissions.IsAuthenticated):
    def has_object_permission(self, request, view, comment):
        # người đang đăng nhập và người đang comment phải khớp nhau (request.user == comment.user)
        return super().has_permission(request, view) and request.user == comment.user


class EcabinetOwner(permissions.IsAuthenticated):
    def has_object_permission(self, request, view, ecabinet):
        return super().has_permission(request, view) and request.user == ecabinet.user


class AdminOwner(permissions.IsAdminUser):
    def has_object_permission(self, request, view, ecabinet):
        return super().has_permission(request, view) and request.user.is_staff == True
