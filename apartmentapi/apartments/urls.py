from django.urls import path, include
from .admin import admin_site
from rest_framework import routers
from apartments import views

r = routers.DefaultRouter()
r.register('users', views.UserViewSet, 'users')
r.register('reciepts', views.RecieptViewSet, 'reciepts')
r.register('carcards', views.CarCardViewSet, 'carcards')
urlpatterns = [path('admin/', admin_site.urls),
               path('', include(r.urls)), ]
