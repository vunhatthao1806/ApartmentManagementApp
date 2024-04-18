from django.contrib import admin
from apartments.models import User, Flat, CarCard, Receipt, ECabinet, Tag, Question, Survey
from django.utils.html import mark_safe
import cloudinary
from django import forms


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


class ApartmentAppAdminSite(admin.AdminSite):
    site_header = "HỆ THỐNG QUẢN LÝ CHUNG CƯ"


admin_site = ApartmentAppAdminSite('myapartment')


class QuestionInline(admin.TabularInline):
    model = Question
    extra = 1


class SurveyAdmin(admin.ModelAdmin):
    inlines = [QuestionInline]


# Register your models here.
admin_site.register(User, UserAdmin)
admin_site.register(Flat)
admin_site.register(CarCard)
admin_site.register(Receipt)
admin_site.register(Tag)
admin_site.register(ECabinet)
admin_site.register(Survey, SurveyAdmin)
