# Generated by Django 5.0.4 on 2024-05-24 15:01

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('apartments', '0013_remove_complaint_tag_complaint_complaint_tag_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='item',
            name='status_tag',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, to='apartments.tag'),
        ),
    ]