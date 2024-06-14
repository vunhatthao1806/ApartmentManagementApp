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
r.register('admins', views.AdminViewSet, 'admins'),
r.register('tags', views.TagViewSet, 'tags'),
r.register('complaints', views.ComplaintViewSet, 'complaints')
r.register('payments', views.PaymentViewSet, 'payments'),
r.register('paymentdetails', views.PaymentDetailViewSet, 'paymentdetails'),
r.register('addcomplaints', views.AddComplaintViewSet, 'addcomplaints')
r.register('phonenumbers', views.PhoneNumberViewSet, 'phonenumbers')
r.register('additem', views.AddItemViewSet, 'additem')
r.register('surveys', views.SurveyViewSet, 'surveys')
r.register('createsurveys', views.CreateSurveyViewSet, 'createsurveys')
r.register('questions', views.QuestionViewSet, 'questions')
r.register('createquestions', views.CreateQuestionViewSet, 'createquestions')
r.register('choices', views.ChoiceViewSet, 'choices')
r.register('answers', views.AnswerViewSet, 'answers')
urlpatterns = [path('admin/', admin_site.urls),
               path('', include(r.urls)), ]
