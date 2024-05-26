from rest_framework import viewsets, generics, status, parsers, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from apartments.models import User, Receipt, CarCard, Item, Comment, Complaint, Flat, ECabinet, Like, Tag
from apartments import serializers, perms, paginators
import djf_surveys.models
class UserViewSet(viewsets.ViewSet):
    queryset = User.objects.filter(is_active=True)
    serializer_class = serializers.UserSerializer
    parser_classes = [parsers.MultiPartParser, ]

    def get_permissions(self):
        if self.action in ['update_current_user','get_ecabinets']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

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

    @action(methods=['get'], url_path='complaints', detail=True)
    def get_complaint(self, request, pk):
        complaint = self.get_object().complaint_set.all()

        return Response(serializers.ComplaintSerializer(complaint, many=True).data, status=status.HTTP_200_OK)
    @action(methods=['get'], url_path = 'carcards', detail = False)
    def get_carcards(self, request):
        user = request.user
        carcards = CarCard.objects.filter(user_id=user.id)
        return Response(serializers.CarCardSerializer(carcards, many=True).data, status=status.HTTP_200_OK)

    # @action(methods=['post'], url_path='users', detail=True)
    # def like(self, request, pk):
    #     li, created = User.objects.get_or_create(user=request.user)
    #


class ReceiptViewSet(viewsets.ViewSet, generics.RetrieveAPIView, generics.ListAPIView, generics.CreateAPIView):
    queryset = Receipt.objects.select_related('tag').all()
    serializer_class = serializers.ReceiptDetailSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        if (request.user.is_staff):
            return self.create(request, *args, **kwargs)

    def get_object(self):
        receipt = super().get_object()
        if receipt.user != self.request.user:
            self.permission_denied(self.request)
        return receipt

    def get_queryset(self):
        queryset = Receipt.objects.filter(user= self.request.user)
        # Lọc hóa đơn theo status (true: đã thanh toán, false: chưa thanh toán)
        status = self.request.query_params.get('status')
        if status:
            queryset = queryset.filter(status = status)

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

    # @action(methods=['get'], url_path="carcarddetail", detail=True)
    # def get_items(self, request, pk):
    #     item = self.get_object().item_set.all()
    #
    #     return Response(serializers.ItemSerializer(item, many=True).data, status=status.HTTP_200_OK)

    # @action(methods=['post'], url_path='add_item', detail=True)
    # def add_items(self, request, pk):
    #     item = self.get_object().item_set.create(name=request.data.get('name'), status=False)
    #
    #     return Response(serializers.ItemSerializer(item).data, status=status.HTTP_201_CREATED)


class FlatViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Flat.objects.all()
    serializer_class = serializers.FlatSerializer


class ECabinetViewSet(viewsets.ViewSet, generics.RetrieveAPIView):
    queryset = ECabinet.objects.filter(active=True)
    serializer_class = serializers.ECabinetSerializer

    def get_permissions(self):
        if self.action in ['add_items']:
            return [permissions.IsAdminUser()]
        return [perms.EcabinetOwner()]

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

    @action(methods=['post'], url_path='add_item', detail=True)
    def add_items(self, request, pk):
        item = self.get_object().item_set.create(name=request.data.get('name'), status=False)

        return Response(serializers.ItemSerializer(item).data, status=status.HTTP_201_CREATED)

class ItemViewSet(viewsets.ViewSet, generics.ListAPIView, generics.UpdateAPIView):
    queryset = Item.objects.all()
    serializer_class = serializers.ItemSerializer
    pagination_class = paginators.ItemPaginator
    permission_classes = [perms.AdminOwner]



class ComplaintViewSet(viewsets.ViewSet, generics.RetrieveAPIView, generics.ListAPIView, generics.CreateAPIView):
    queryset = Complaint.objects.filter(active=True) # tag lúc nào cũng cần dùng khi vào chi tiết complaint
    serializer_class = serializers.ComplaintDetailSerializer

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
        if self.action in ['add_comment', 'like', 'post']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    @action(methods=['get'], url_path='get_likes', detail=True)
    def get_likes(self, request, pk):
        complaint = self.get_object()
        likes = Like.objects.filter(complaint=complaint, active=True).count()

        return Response({likes}, status=status.HTTP_200_OK)

    @action(methods=['get'], url_path='comments', detail=True)
    def get_comments(self, request, pk):
        comments = self.get_object().comment_set.all() # select_related('user').
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

class CommentViewSet(viewsets.ViewSet, generics.DestroyAPIView, generics.UpdateAPIView, generics.ListAPIView):
    queryset = Comment.objects.all()
    serializer_class = serializers.CommentSerializer
    permission_classes = [perms.CommentOwner]


class AdminViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView, generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = serializers.UserSerializer
    parser_classes = [parsers.MultiPartParser, ]
    permission_classes = [perms.AdminOwner]


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