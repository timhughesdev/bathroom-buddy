# Generated by Django 5.0.6 on 2024-07-02 00:11

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('restroom_app', '0005_restroom_api_restroom_key'),
        ('reviews_app', '0003_alter_review_restroom_alter_review_user'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterField(
            model_name='review',
            name='restroom',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='restroom_reviews', to='restroom_app.restroom'),
        ),
        migrations.AlterField(
            model_name='review',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_reviews', to=settings.AUTH_USER_MODEL),
        ),
    ]
