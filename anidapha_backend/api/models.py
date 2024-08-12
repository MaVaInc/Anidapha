from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager


class UserManager(BaseUserManager):
    def create_user(self, telegram_id, username, **extra_fields):
        if not telegram_id:
            raise ValueError('The Telegram ID must be set')
        if not username:
            raise ValueError('The username must be set')
        user = self.model(telegram_id=telegram_id, username=username, **extra_fields)
        user.save(using=self._db)
        return user


class User(AbstractBaseUser):
    telegram_id = models.CharField(max_length=255, unique=True)
    username = models.CharField(max_length=255, unique=True)
    first_name = models.CharField(max_length=255, null=True, blank=True)
    last_name = models.CharField(max_length=255, null=True, blank=True)
    photo_url = models.URLField(max_length=1024, null=True, blank=True)
    auth_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    ton_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    platinum_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    gold_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    objects = UserManager()

    USERNAME_FIELD = 'telegram_id'

    def __str__(self):
        return self.username
