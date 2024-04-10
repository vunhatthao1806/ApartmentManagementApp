from django.db import models
from django.contrib.auth.models import AbstractUser
from ckeditor.fields import RichTextField
from cloudinary.models import CloudinaryField


class BaseModel(models.Model):
    create_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    active = models.BooleanField(default=True)

    class Meta:
        abstract = True
        ordering = ['-id']


class CarCard(BaseModel):
    type = models.CharField(max_length=100, unique=True)
    number_plate = models.CharField(max_length=20)

    def __str__(self):
        return self.number_plate


class User(AbstractUser):
    avatar = CloudinaryField(null=True)
    car_card = models.ForeignKey(CarCard, on_delete=models.CASCADE)


class Tag(BaseModel):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class ECabinet(models.Model):
    name = models.CharField(max_length=20)


class Item(models.Model):
    status = models.BooleanField()
    name = models.CharField(max_length=255)
    e_cabinet = models.ForeignKey(ECabinet, on_delete=models.PROTECT)


class Flat(models.Model):  # Flat xoa thi user mat, thi ecabinet mat
    name = models.CharField(max_length=50)
    description = RichTextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    e_cabinet = models.ForeignKey(ECabinet, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class Receipt(BaseModel):
    title = models.CharField(max_length=255)
    tag = models.ForeignKey(Tag, on_delete=models.PROTECT)
    flat = models.ForeignKey(Flat, on_delete=models.PROTECT)


class Resident(models.Model):
    identity_num = models.CharField(max_length=25)
    user = models.ForeignKey(User, on_delete=models.CASCADE)


class Board(models.Model):
    position = models.CharField(max_length=255)
    user = models.ForeignKey(User, on_delete=models.CASCADE)


class Survey(BaseModel):
    title = models.CharField(max_length=255)
    user = models.ManyToManyField(User)


class Complaint(BaseModel):
    title = models.CharField(max_length=255)
    content = RichTextField()
    image = CloudinaryField()
    user = models.ForeignKey(User, on_delete=models.PROTECT)
    tag = models.ManyToManyField(Tag)

# class Interaction(BaseModel):
#     user = models.ForeignKey(User, on_delete=models.CASCADE)
#     lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
#
#     class Meta:
#         abstract = True
#
#
# class Comment(Interaction):
#     content = models.CharField(max_length=255)
#
#
# class Like(Interaction):
#     class Meta:
#         unique_together = ('lesson', 'user')
