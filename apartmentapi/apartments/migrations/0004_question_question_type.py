# Generated by Django 5.0.4 on 2024-04-18 10:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('apartments', '0003_question'),
    ]

    operations = [
        migrations.AddField(
            model_name='question',
            name='question_type',
            field=models.CharField(choices=[('text', 'Câu hỏi tự luận'), ('mc', 'Câu hỏi trắc nghiệm')], default='text', max_length=255),
        ),
    ]
