from rest_framework import serializers
from apartments.models import User, Receipt, Tag, CarCard, Complaint, Comment, Item, Flat, ECabinet
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
        fields = ['title', 'created_date']


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id','name']

class ReceiptDetailSerializer(serializers.ModelSerializer):
    tag = TagSerializer()

    class Meta:
        model = ReceiptSerializer.Meta.model
        fields = ReceiptSerializer.Meta.fields + ['tag', 'total']

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
        fields = ['id', 'type', 'number_plate', 'image_mrc_m1', 'image_mrc_m2', 'image_idcard_m1', 'image_idcard_m2']


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
        fields = ['id', 'name', 'status', 'e_cabinet', 'status_tag', 'image']



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
