from rest_framework import serializers
from apartments.models import User, Receipt, Tag, CarCard, Complaint, Comment, Item, Flat, ECabinet, PaymentDetail, PhoneNumber,Survey, Question, Choice, AnswerUser
import djf_surveys.models


# Chỉnh đường dẫn cloudinary thành đường dẫn tuyệt đối
class ImageSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        rep = super().to_representation(instance)
        if instance.avatar:
            rep['avatar'] = instance.avatar.url
        return rep


class FlatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Flat
        fields = '__all__'


class ECabinetSerializer(serializers.ModelSerializer):
    count_items = serializers.SerializerMethodField()

    class Meta:
        model = ECabinet
        fields = ['id', 'name', 'user', 'active', 'count_items']

    def get_count_items(self, obj):
        return obj.item_set.count()

class EcabinetDetailSerializer(ECabinetSerializer):
    class Meta:
        model = ECabinetSerializer.Meta.model
        fields = ECabinetSerializer.Meta.fields + ['phone_number']
class PhoneNumberSerializer(serializers.ModelSerializer):
    class Meta:
        model = PhoneNumber
        fields = ['id', 'number', 'user']



class UserSerializer(ImageSerializer):
    class Meta:
        model = User
        fields = '__all__'
        extra_kwargs = {
            'password': {
                'write_only': True
            }
        }


class ReceiptSerializer(serializers.ModelSerializer):
    class Meta:
        model = Receipt
        fields = ['id', 'title', 'created_date']


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']


class ReceiptDetailSerializer(serializers.ModelSerializer):
    tag = TagSerializer()
    flat = FlatSerializer()

    class Meta:
        model = ReceiptSerializer.Meta.model
        fields = ReceiptSerializer.Meta.fields + ['tag', 'total', 'flat']


class PaymentDetailSerializer(ImageSerializer):
    def to_representation(self, instance):
        req = super().to_representation(instance)
        if instance.image:
            req['image'] = instance.image.url

        return req
    class Meta:
        model = PaymentDetail
        fields = ['image']


class CarCardSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        req = super().to_representation(instance)
        image_fields = ['image_mrc_m1', 'image_mrc_m2', 'image_idcard_m1', 'image_idcard_m2']

        for field in image_fields:
            if hasattr(instance, field) and getattr(instance, field):
                req[field] = getattr(instance, field).url

        return req

    class Meta:
        model = CarCard
        fields = ['id', 'type', 'number_plate', 'image_mrc_m1', 'image_mrc_m2', 'image_idcard_m1', 'image_idcard_m2', 'created_date']


class ComplaintSerializer(serializers.ModelSerializer):
    # chỉnh đường dẫn trực tiếp cloudinary cho ảnh
    def to_representation(self, instance):
        req = super().to_representation(instance)
        if instance.image:
            req['image'] = instance.image.url

        return req

    user = UserSerializer()

    class Meta:
        model = Complaint
        fields = ['id', 'title', 'user', 'created_date']


class ComplaintDetailSerializer(ComplaintSerializer):
    status_tag = TagSerializer()
    complaint_tag = TagSerializer()

    class Meta:
        model = ComplaintSerializer.Meta.model
        fields = ComplaintSerializer.Meta.fields + ['content', 'status_tag', 'complaint_tag']


class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Comment
        fields = ['id', 'content', 'created_date', 'updated_date', 'user', 'complaint']


class ItemSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        req = super().to_representation(instance)
        if instance.image:
            req['image'] = instance.image.url

        return req

    status_tag = TagSerializer()

    class Meta:
        model = Item
        fields = ['id', 'name', 'e_cabinet', 'status_tag', 'image']


class AuthenticatedComplaintDetailSerializer(ComplaintSerializer):
    liked = serializers.SerializerMethodField()

    def get_liked(self, complaint):
        request = self.context.get('request')
        if request:
            return complaint.like_set.filter(user=request.user, active=True).exists()

    class Meta:
        model = ComplaintSerializer.Meta.model
        fields = ComplaintSerializer.Meta.fields + ['liked']


class SurveySerializer(serializers.ModelSerializer):
    class Meta:
        model = djf_surveys.models.Survey
        fields = ['id', 'name', 'description']


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = djf_surveys.models.Question
        fields = ['id', 'label', 'type_field', 'choices']


class AddComplaintSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        req = super().to_representation(instance)
        if instance.image:
            req['image'] = instance.image.url

        return req

    class Meta:
        model = Complaint
        fields = ['id', 'title', 'created_date', 'content', 'status_tag', 'complaint_tag', 'image']

class AddItemSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        req = super().to_representation(instance)
        if instance.image:
            req['image'] = instance.image.url

        return req
    class Meta:
        model = Item
        fields = ['id', 'name', 'status_tag', 'e_cabinet', 'image']

class SurveySerializer(serializers.ModelSerializer):
    count_users = serializers.SerializerMethodField()
    user_create = UserSerializer()

    class Meta:
        model = Survey
        fields = ['id', 'title', 'created_date', 'active', 'content', 'user_create', 'count_users']

    def get_count_users(self, obj):
        return obj.survey_user_done.count()


class CreateSurveySerializer(serializers.ModelSerializer):
    class Meta:
        model = Survey
        fields = ['id', 'title', 'content']


class CreateQuestionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['id', 'name', 'survey']


class QuestionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Question
        fields = ['id', 'name', 'survey']


class ChoiceSerializer(serializers.ModelSerializer):
    # question = QuestionSerializer()

    class Meta:
        model = Choice
        fields = ['id', 'name', 'question']


class AnswerSerializer(serializers.ModelSerializer):
    # question = QuestionSerializer()
    # user = UserSerializer()
    # survey = SurveySerializer()

    class Meta:
        model = AnswerUser
        fields = ['id', 'question', 'survey', 'user']