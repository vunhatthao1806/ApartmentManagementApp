from rest_framework import serializers
from apartments.models import User, Receipt, Tag, CarCard


class ItemSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['avatar'] = instance.avatar.url
        return rep


class UserSerializer(ItemSerializer):
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
# class ItemSerializer(serializers.ModelSerializer):
#     def to_representation(self, instance):
#         req = super().to_representation(instance)
#         req['image'] = instance.image.url
#
#         return req
#
#
# class CourseSerializer(ItemSerializer):
#
#     class Meta:
#         model = Course
#         fields = ['id', 'name', 'image', 'created_date']
#
#
# class TagSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Tag
#         fields = ['id', 'name']
#
#
# class LessonSerializer(ItemSerializer):
#
#     class Meta:
#         model = Lesson
#         fields = ['id', 'subject', 'image', 'created_date']
#
#
# class LessonDetailsSerializer(LessonSerializer):
#     tags = TagSerializer(many=True)
#
#     class Meta:
#         model = LessonSerializer.Meta.model
#         fields = LessonSerializer.Meta.fields + ['content', 'tags']
#
#
# class AuthenticatedLessonDetailsSerializer(LessonDetailsSerializer):
#     liked = serializers.SerializerMethodField()
#
#     def get_liked(self, lesson):
#         request = self.context.get('request')
#         if request:
#             return lesson.like_set.filter(user=request.user, active=True).exists()
#
#     class Meta:
#         model = LessonDetailsSerializer.Meta.model
#         fields = LessonDetailsSerializer.Meta.fields + ['liked']
#
#
# class UserSerializer(serializers.ModelSerializer):
#
#     def create(self, validated_data):
#         data = validated_data.copy()
#         u = User(**data)
#         u.set_password(u.password)
#         u.save()
#
#         return u
#
#     def to_representation(self, instance):
#         rep = super().to_representation(instance)
#         if instance.avatar:
#             rep['avatar'] = instance.avatar.url
#
#         return rep
#
#     class Meta:
#         model = User
#         fields = ['id', 'first_name', 'last_name', 'email', 'username', 'password', 'avatar']
#         extra_kwargs = {
#             'password': {
#                 'write_only': True
#             }
#         }
#
#
# class CommentSerializer(serializers.ModelSerializer):
#     user = UserSerializer()
#
#     class Meta:
#         model = Comment
#         fields = ['id', 'content', 'created_date', 'updated_date', 'user']
