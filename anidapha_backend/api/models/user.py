from datetime import datetime

from django.db import models, transaction
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils import timezone

class UserManager(BaseUserManager):
    def create_user(self, telegram_id, username, password=None, **extra_fields):
        if not telegram_id:
            raise ValueError('The Telegram ID must be set')
        if not username:
            raise ValueError('The username must be set')

        extra_fields.setdefault('is_active', True)
        user = self.model(telegram_id=telegram_id, username=username, **extra_fields)
        user.set_password(password)
        with transaction.atomic():
            user.save(using=self._db)
        return user

    def create_superuser(self, telegram_id, username, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(telegram_id=telegram_id, username=username, password=password, **extra_fields)

class User(AbstractUser):
    telegram_id = models.CharField(max_length=255, unique=True)
    first_name = models.CharField(max_length=255, null=True, blank=True)
    last_name = models.CharField(max_length=255, null=True, blank=True)
    photo_url = models.URLField(max_length=1024, null=True, blank=True)
    auth_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    ton_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    dogs_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    platinum_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    gold_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    count_purchases = models.IntegerField(default=0)
    last_daily_reward = models.DateTimeField(null=True, blank=True)

    objects = UserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['telegram_id']

    def save(self, *args, **kwargs):
        # Если auth_date - это целое число (Unix timestamp), преобразуем его в datetime
        if self.auth_date and isinstance(self.auth_date, int):
            self.auth_date = datetime.fromtimestamp(self.auth_date)

        # Преобразуем в aware datetime, если дата наивная
        if self.auth_date and timezone.is_naive(self.auth_date):
            self.auth_date = timezone.make_aware(self.auth_date)

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.first_name} {self.last_name}" if self.first_name or self.last_name else self.username
