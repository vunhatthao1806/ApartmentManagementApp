from rest_framework import serializers
from apartments.models import User, Receipt, Tag, CarCard, Complaint, Comment, Item, Flat, ECabinet
import djf_surveys.models


# Chỉnh đường dẫn cloudinary thành đường dẫn tuyệt đối
class ImageSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['avatar'] = instance.avatar.url
        return rep



class FlatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Flat
        fields = '__all__'


class ECabinetSerializer(serializers.ModelSerializer):
    class Meta:
        model = ECabinet
        fields = ['id', 'name', 'user', 'active']



class ECabinetDetailSerializer(ECabinetSerializer):

    class Meta:
        model = ECabinetSerializer.Meta.model
        fields = ECabinetSerializer.Meta.fields


class UserSerializer(ImageSerializer):
    class Meta:
        model = User
        fields = '__all__'
        extra_kwargs = {
            'password': {
                'write_only': True
            }
        }


class RecieptSerializer(serializers.ModelSerializer):
    class Meta:
        model = Receipt
        fields = ['title']


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']


class RecieptDetailsSerializer(RecieptSerializer):
    tag = TagSerializer()

    class Meta:
        model = RecieptSerializer.Meta.model
        fields = RecieptSerializer.Meta.fields + ['tag']


class CarCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarCard
        fields = '__all__'


class ComplaintSerializer(ImageSerializer):
    class Meta:
        model = Complaint
        fields = ['id', 'title']


class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Comment
        fields = ['id', 'content', 'created_date', 'updated_date', 'user', 'complaint']


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ['id', 'name', 'status', 'e_cabinet']


class ComplaintDetailSerializer(ComplaintSerializer):
    tag = TagSerializer(many=True)

    class Meta:
        model = ComplaintSerializer.Meta.model
        fields = ComplaintSerializer.Meta.fields + ['content', 'tag']


class AuthenticatedComplaintDetailSerializer(ComplaintDetailSerializer):
    liked = serializers.SerializerMethodField()

    def get_liked(self, complaint):
        request = self.context.get('request')
        if request:
            return complaint.like_set.filter(user=request.user, active=True).exists()

    class Meta:
        model = ComplaintDetailSerializer.Meta.model
        fields = ComplaintDetailSerializer.Meta.fields + ['liked']


class SurveySerializer(serializers.ModelSerializer):
    class Meta:
        model = djf_surveys.models.Survey
        fields = ['id', 'name', 'description']


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = djf_surveys.models.Question
        fields = ['id', 'label', 'type_field', 'choices']
