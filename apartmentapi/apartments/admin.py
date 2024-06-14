from django.contrib import admin
from apartments.models import User, Flat, CarCard, Receipt, ECabinet, Tag, Comment, Complaint, Item, PaymentDetail, PhoneNumber, Survey, AnswerUser, Question, Choice
from django.utils.html import mark_safe
from oauth2_provider.models import Application, AccessToken, Grant, IDToken, RefreshToken
import cloudinary
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

class ApartmentAppAdminSite(admin.AdminSite):
    site_header = "HỆ THỐNG QUẢN LÝ CHUNG CƯ"


admin_site = ApartmentAppAdminSite('myapartment')


class CustomUserCreationForm(UserCreationForm):
    class Meta:
        model = User
        fields = ('username', 'email', 'first_name', 'last_name')

class CustomUserChangeForm(UserChangeForm):
    class Meta:
        model = User
        fields = ('username', 'email', 'first_name', 'last_name')
class UserAdmin(BaseUserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    list_display = ['username', 'first_name', 'last_name']
    search_fields = ['username']
    list_filter = ['username', 'first_name', 'last_name']
    readonly_fields = ['my_avatar']
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email', 'avatar')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'first_name', 'last_name', 'password1', 'password2', 'avatar'),
        }),
    )

    def my_avatar(self, user):
        if user.avatar:
            if isinstance(user.avatar, cloudinary.CloudinaryResource):
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
    list_display = ['id', 'name', 'e_cabinet']
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
admin_site.register(PaymentDetail)
admin_site.register(PhoneNumber)
admin_site.register(Choice)
admin_site.register(AnswerUser)
admin_site.register(Question)
admin_site.register(Survey)
