from django.urls import path, include
from .admin import admin_site
from rest_framework import routers
from apartments import views

r = routers.DefaultRouter()
r.register('users', views.UserViewSet, 'users')
r.register('receipts', views.ReceiptViewSet, 'receipts')
r.register('carcards', views.CarCardViewSet, 'carcards')
r.register('flats', views.FlatViewSet, 'flats')
r.register('ecabinets', views.ECabinetViewSet, 'ecabinets')
r.register('items', views.ItemViewSet, 'items')
r.register('comments', views.CommentViewSet, 'comments')
r.register('surveys', views.SurveyViewSet, 'surveys')
r.register('admins', views.AdminViewSet, 'admins'),
r.register('tags', views.TagViewSet, 'tags'),
r.register('complaints', views.ComplaintViewSet, 'complaints')
urlpatterns = [path('admin/', admin_site.urls),
               path('', include(r.urls)), ]
