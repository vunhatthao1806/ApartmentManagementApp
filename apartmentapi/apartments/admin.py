from django.contrib import admin
from apartments.models import User, Flat, CarCard, Receipt, ECabinet, Tag, Comment, Complaint, Item, PaymentDetail
from django.utils.html import mark_safe
from oauth2_provider.models import Application, AccessToken, Grant, IDToken, RefreshToken
from djf_surveys.models import Answer, Question, Survey, UserAnswer
import cloudinary


class ApartmentAppAdminSite(admin.AdminSite):
    site_header = "HỆ THỐNG QUẢN LÝ CHUNG CƯ"


admin_site = ApartmentAppAdminSite('myapartment')


class UserAdmin(admin.ModelAdmin):
    list_display = ['username', 'first_name', 'last_name']
    search_fields = ['username']
    list_filter = ['username', 'first_name', 'last_name']
    readonly_fields = ['my_avatar']

    def my_avatar(self, user):
        if user.avatar:
            if type(user.avatar) is cloudinary.CloudinaryResource:
                return mark_safe(f"<img width='300' src='{user.avatar.url}' />")

    class Media:
        css = {
            'all': ['/static/css/style.css']
        }


class FlatAdmin(admin.ModelAdmin):
    list_display = ['id', 'floor', 'block', 'apartment_num']
    search_fields = ['floor', 'block', 'apartment_num']
    list_filter = ['apartment_num']

    class Media:
        css = {
            'all': ['/static/css/style.css']
        }


class ECabinetAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'user', 'active']
    search_fields = ['name']


class ItemAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'e_cabinet', 'status_text']
    search_fields = ['name']


class ComplaintAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'active', 'created_date', 'updated_date']
    search_fields = ['title']
    readonly_fields = ['my_image']

    def my_image(self, complaint):
        if complaint.image:
            if type(complaint.image) is cloudinary.CloudinaryResource:
                return mark_safe(f"<img width='300' src='{complaint.image.url}' />")
            return mark_safe(f"<img width='300' src='{complaint.image.title}' />")


class ReceiptAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'status', 'created_date', 'updated_date']
    search_fields = ['name', 'status']


# Register your models here.
admin_site.register(User, UserAdmin)
admin_site.register(Flat, FlatAdmin)
admin_site.register(CarCard)
admin_site.register(Receipt, ReceiptAdmin)
admin_site.register(Complaint, ComplaintAdmin)
admin_site.register(Tag)
admin_site.register(ECabinet, ECabinetAdmin)
admin_site.register(Comment)
admin_site.register(Item, ItemAdmin)
admin_site.register(Grant)
admin_site.register(AccessToken)
admin_site.register(IDToken)
admin_site.register(RefreshToken)
admin_site.register(Application)
admin_site.register(Answer)
admin_site.register(Question)
admin_site.register(Survey)
admin_site.register(UserAnswer)
admin_site.register(PaymentDetail)
