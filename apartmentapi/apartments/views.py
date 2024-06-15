import os
import urllib
import uuid
from datetime import datetime
import requests as external_requests
from django.contrib.sites import requests
from django.http import JsonResponse
from drf_yasg.inspectors import view
from rest_framework import viewsets, generics, status, parsers, permissions
from rest_framework.decorators import action
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from apartments.models import User, Receipt, CarCard, Item, Comment, Complaint, Flat, ECabinet, Like, Tag, PhoneNumber, Choice, Question, Survey, AnswerUser
from apartments import serializers, perms, paginators
import djf_surveys.models
import hashlib
import hmac


class UserViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = serializers.UserSerializer
    parser_classes = [parsers.MultiPartParser, ]
    pagination_class = paginators.AdminPaginator
    def get_permissions(self):
        if self.action in ['update_current_user', 'get_ecabinets']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]
    def get_queryset(self):
        queryset = User.objects.filter(is_staff = False)
        # Tìm kiếm từ khóa
        q = self.request.query_params.get('q')
        if q:
            queryset = queryset.filter(username__icontains=q)
        return queryset
    @action(methods=['get', 'patch'], url_path='current-user', detail=False)
    def update_current_user(self, request):
        user = request.user
        for k, v in request.data.items():
            if k == 'password':
                user.set_password(v)
            elif k == 'avatar':
                user.avatar = v
            else:
                setattr(user, k, v)
        user.save()
        return Response(serializers.UserSerializer(user).data)

    @action(methods=['get'], url_path='ecabinets', detail=False)
    def get_ecabinets(self, request):
        user = request.user

        ecabinets = ECabinet.objects.filter(user_id=user.id)
        return Response(serializers.ECabinetSerializer(ecabinets, many=True).data, status=status.HTTP_200_OK)

    @action(methods=['get'], url_path='carcards', detail=False)
    def get_carcards(self, request):
        user = request.user
        carcards = CarCard.objects.filter(user_id=user.id)
        paginator = PageNumberPagination()
        paginator.page_size = 4
        result_page = paginator.paginate_queryset(carcards, request)
        serializer = serializers.CarCardSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)


class ReceiptViewSet(viewsets.ViewSet, generics.RetrieveAPIView, generics.ListAPIView, generics.CreateAPIView):
    queryset = Receipt.objects.select_related('tag', 'flat').all()
    serializer_class = serializers.ReceiptDetailSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = paginators.ReceiptPaginator

    def post(self, request, *args, **kwargs):
        if (request.user.is_staff):
            return self.create(request, *args, **kwargs)

    def get_queryset(self):
        queryset = Receipt.objects.filter(user=self.request.user)  # Lấy hóa đơn của user đang request
        # Lọc hóa đơn theo status (true: đã thanh toán, false: chưa thanh toán)
        status = self.request.query_params.get('status')
        if status:
            queryset = queryset.filter(status=status)
        # Tìm kiếm từ khóa
        q = self.request.query_params.get('q')
        if q:
            queryset = queryset.filter(title__icontains=q)
        return queryset


class CarCardViewSet(viewsets.ViewSet, generics.CreateAPIView, generics.RetrieveAPIView):
    queryset = CarCard.objects.filter(active=True)
    serializer_class = serializers.CarCardSerializer
    permission_classes = [perms.CarcardOwner]

    def perform_create(self, serializer):
        user = self.request.user
        flat = Flat.objects.filter(user_id=user.id).first()
        serializer.save(user=user, flat=flat)

    # tìm kiếm tủ đồ
    def get_queryset(self):
        queryset = self.queryset

        if self.action.__eq__('list'):
            q = self.request.query_params.get('q')
            if q:
                queryset = queryset.filter(name__icontains=q)
        return queryset


class FlatViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Flat.objects.all()
    serializer_class = serializers.FlatSerializer

    # tìm kiếm flat active
    def get_queryset(self):
        queryset = self.queryset

        if self.action.__eq__('list'):
            flat_id = self.request.query_params.get('flat_id')
            if flat_id:
                queryset = queryset.filter(active=True)

        return queryset


class ECabinetViewSet(viewsets.ViewSet, generics.RetrieveAPIView, generics.ListAPIView):
    queryset = ECabinet.objects.filter(active=True)
    serializer_class = serializers.EcabinetDetailSerializer

    # def get_permissions(self):
    #     if self.action in ['add_items']:
    #         return [permissions.IsAdminUser()]
    #     return [perms.EcabinetOwner()]

    # tìm kiếm tủ đồ
    def get_queryset(self):
        queryset = self.queryset

        # lọc ecabinet theo ten ecabinet ma khong anh huong den item trong ecabinet
        if self.action.__eq__('list'):
            q = self.request.query_params.get('q')
            if q:
                queryset = queryset.filter(name__icontains=q)
        return queryset

    @action(methods=['get'], url_path='items', detail=True)
    def get_items(self, request, pk):
        item = self.get_object().item_set.all()

        return Response(serializers.ItemSerializer(item, many=True).data, status=status.HTTP_200_OK)


class AddItemViewSet(viewsets.ViewSet, generics.CreateAPIView, generics.UpdateAPIView):
    queryset = Item.objects.filter(active=True)  # tag lúc nào cũng cần dùng khi vào chi tiết complaint
    serializer_class = serializers.AddItemSerializer
    permission_classes = [perms.AdminOwner]


class PhoneNumberViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = PhoneNumber.objects.all()
    serializer_class = serializers.PhoneNumberSerializer
    # permission_classes = [perms.AdminOwner]


class ItemViewSet(viewsets.ViewSet, generics.ListAPIView, generics.UpdateAPIView):
    queryset = Item.objects.all()
    serializer_class = serializers.ItemSerializer
    # pagination_class = paginators.ItemPaginator
    permission_classes = [perms.AdminOwner]


class AddComplaintViewSet(viewsets.ViewSet, generics.CreateAPIView):
    queryset = Complaint.objects.filter(active=True)  # tag lúc nào cũng cần dùng khi vào chi tiết complaint
    serializer_class = serializers.AddComplaintSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user
        # complaint = Complaint.objects.filter(user_id=user.id).first()
        serializer.save(user=user)


class ComplaintViewSet(viewsets.ViewSet, generics.RetrieveAPIView, generics.ListAPIView, generics.CreateAPIView):
    queryset = Complaint.objects.filter(active=True)  # tag lúc nào cũng cần dùng khi vào chi tiết complaint
    serializer_class = serializers.ComplaintDetailSerializer
    pagination_class = paginators.ComplaintPaginator

    def get_serializer_class(self):
        if self.request.user.is_authenticated:
            return serializers.AuthenticatedComplaintDetailSerializer

        return self.serializer_class

    def get_queryset(self):
        queryset = self.queryset

        if self.action.__eq__('list'):

            complaint_tag_id = self.request.query_params.get('complaint_tag_id')
            if complaint_tag_id:
                queryset = queryset.filter(complaint_tag_id=complaint_tag_id)

        return queryset

    def get_permissions(self):
        if self.action in ['add_comment', 'like']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    @action(methods=['get'], url_path='get_likes', detail=True)
    def get_likes(self, request, pk):
        complaint = self.get_object()
        likes = Like.objects.filter(complaint=complaint, active=True).count()

        return Response({likes}, status=status.HTTP_200_OK)

    @action(methods=['get'], url_path='comments', detail=True)
    def get_comments(self, request, pk):
        comments = self.get_object().comment_set.all()  # select_related('user').
        return Response(serializers.CommentSerializer(comments, many=True).data,
                        status=status.HTTP_200_OK)

    @action(methods=['post'], url_path='add_comment', detail=True)
    def add_comment(self, request, pk):  # chỉ chứng thực mới được vô
        c = self.get_object().comment_set.create(user=request.user, content=request.data.get('content'))
        # get_object() : trả về đối tượng complaint đại diện cho khóa chính mà gửi lên
        return Response(serializers.CommentSerializer(c).data, status=status.HTTP_201_CREATED)

    @action(methods=['post'], url_path='like', detail=True)
    def like(self, request, pk):
        li, created = Like.objects.get_or_create(complaint=self.get_object(), user=request.user)

        if not created:
            li.active = not li.active
            li.save()

        return Response(serializers.AuthenticatedComplaintDetailSerializer(self.get_object()).data)


class CommentViewSet(viewsets.ViewSet, generics.DestroyAPIView, generics.UpdateAPIView):
    queryset = Comment.objects.all()
    serializer_class = serializers.CommentSerializer
    permission_classes = [perms.CommentOwner]


class AdminViewSet(viewsets.ViewSet, generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = serializers.UserSerializer
    parser_classes = [parsers.MultiPartParser, ]
    permission_classes = [perms.AdminOwner]

    @action(methods=['patch'], detail=True, url_path='update_active')
    def update_user_status(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
            is_active = request.data.get('is_active')
            user.is_active = is_active
            user.save()
            return Response({'message': 'User status updated successfully'}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

class SurveyViewSet(viewsets.ViewSet, generics.RetrieveAPIView):
    queryset = djf_surveys.models.Survey.objects.all()
    serializer_class = serializers.SurveySerializer

    @action(methods=['get'], url_path='questions', detail=True)
    def get_surveys(self, request, pk):
        questions = self.get_object().questions.all()

        return Response(serializers.QuestionSerializer(questions, many=True).data, status=status.HTTP_200_OK)

    @action(methods=['get'], url_path='questions_count', detail=True)
    def get_survey_questions_count(self, request, pk):
        survey = self.get_object()
        question_count = survey.questions.count()

        return Response({'question_count': question_count}, status=status.HTTP_200_OK)


class TagViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Tag.objects.all()
    serializer_class = serializers.TagSerializer


class PaymentDetailViewSet(viewsets.ViewSet, generics.CreateAPIView):
    serializer_class = serializers.PaymentDetailSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            receipt_id = request.query_params.get('receipt_id')
            payment_detail = serializer.save(receipt_id=receipt_id)
            # Cập nhật trạng thái của Receipt
            receipt = payment_detail.receipt
            receipt.status = True
            receipt.save()
            return Response({'message': 'Payment detail created and receipt status updated successfully.'},
                            status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PaymentViewSet(viewsets.ViewSet):
    def get_permissions(self):
        if self.action in ['create-payment']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    @action(methods=['post'], detail=False, url_path='create-payment')
    def create_payment(self, request):
        receipt_id = request.query_params.get('receipt_id')
        total = request.query_params.get('total')
        if total is None:
            return Response({'error': 'Total amount is required'}, status=400)
        # Lưu orderId vào cơ sở dữ liệu
        new_order = str(uuid.uuid4())
        receipt = Receipt.objects.get(id=receipt_id)
        receipt.order_id = new_order
        receipt.save()
        # Các thông tin cần thiết
        partnerCode = "MOMO"
        accessKey = "F8BBA842ECF85"
        secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz"
        orderInfo = "pay with MoMo"
        redirectUrl = "http://192.168.1.8:8000/payments/momo-return/"
        ipnUrl = "http://192.168.1.8:8000/payments/momo-return/"
        amount = str(total)  # Lấy số tiền từ request của client
        orderId = new_order
        requestId = str(uuid.uuid4())
        requestType = "payWithATM"
        extraData = ""  # Pass empty value or Encode base64 JsonString

        # Tạo raw signature
        rawSignature = ("accessKey=" + accessKey +
                        "&amount=" + amount +
                        "&extraData=" + extraData +
                        "&ipnUrl=" + ipnUrl +
                        "&orderId=" + orderId +
                        "&orderInfo=" + orderInfo +
                        "&partnerCode=" + partnerCode +
                        "&redirectUrl=" + redirectUrl +
                        "&requestId=" + requestId +
                        "&requestType=" + requestType)
        # Tạo signature
        signature = hmac.new(bytes(secretKey, 'ascii'), bytes(rawSignature, 'ascii'), hashlib.sha256).hexdigest()

        # Tạo JSON request
        data = {
            'partnerCode': partnerCode,
            'partnerName': "Test",
            'storeId': "MomoTestStore",
            'requestId': requestId,
            'amount': amount,
            'orderId': orderId,
            'orderInfo': orderInfo,
            'redirectUrl': redirectUrl,
            'ipnUrl': ipnUrl,
            'lang': "vi",
            'extraData': extraData,
            'requestType': requestType,
            'signature': signature
        }
        print("Data gửi đi:", data)
        # Gửi yêu cầu đến endpoint của Momo
        response = external_requests.post("https://test-payment.momo.vn/v2/gateway/api/create", json=data)

        # Trả về link thanh toán cho client
        if response.status_code == 200:
            payUrl = response.json().get('payUrl')
            print(payUrl)
            return Response({'payUrl': payUrl})
        else:
            return Response({'error': 'Failed to create payment link'}, status=response.status_code)

    @action(methods=['get'], detail=False, url_path='momo-return')
    def momo_return(self, request):
        data = request.query_params
        order_id = data.get('orderId')
        try:
            # Kiểm tra và cập nhật trạng thái của receipt
            receipt = Receipt.objects.get(order_id=order_id)
            receipt.status = True
            receipt.save()
            return Response({'message': 'Payment successful, Receipt updated successfully'})
        except Exception as e:
            return Response({'error': f'Error updating receipt status: {str(e)}'}, status=500)

class SurveyViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Survey.objects.all()
    serializer_class = serializers.SurveySerializer

    @action(methods=['get'], url_path='questions', detail=True)
    def get_questions(self, request, pk):
        q = self.get_object().question_set.all()

        return Response(serializers.QuestionSerializer(q, many=True).data, status=status.HTTP_200_OK)

    @action(methods=['post'], url_path='create_questions', detail=True)
    def create_questions(self, request, pk):
        survey = self.get_object()
        q = Question.objects.create(name=request.data.get('name'), survey=survey)

        return Response(serializers.CreateQuestionsSerializer(q).data,
                        status=status.HTTP_201_CREATED)


class QuestionViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Question.objects.all()
    serializer_class = serializers.QuestionSerializer

    @action(methods=['get'], url_path='choices', detail=True)
    def get_choices(self, request, pk):
        c = self.get_object().choice_set.all()

        return Response(serializers.ChoiceSerializer(c, many=True).data, status=status.HTTP_200_OK)

    @action(methods=['post'], url_path='create_choices', detail=True)
    def create_choices(self, request, pk):
        question = self.get_object()
        c = Choice.objects.create(name=request.data.get('name'), question=question)

        return Response(serializers.ChoiceSerializer(c).data,
                        status=status.HTTP_201_CREATED)


class ChoiceViewSet(viewsets.ViewSet, generics.ListAPIView, generics.CreateAPIView):
    queryset = Choice.objects.all()
    serializer_class = serializers.ChoiceSerializer


class AnswerViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = AnswerUser.objects.all()
    serializer_class = serializers.AnswerSerializer


class CreateSurveyViewSet(viewsets.ViewSet, generics.CreateAPIView):
    queryset = Question.objects.all()
    serializer_class = serializers.CreateSurveySerializer

    def perform_create(self, serializer):
        user = self.request.user
        serializer.save(user_create=user)




class CreateQuestionViewSet(viewsets.ViewSet, generics.CreateAPIView):
    queryset = Question.objects.all()
    serializer_class = serializers.CreateQuestionsSerializer