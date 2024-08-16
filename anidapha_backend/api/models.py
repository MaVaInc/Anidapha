from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin, AbstractUser


class UserManager(BaseUserManager):
    def create_user(self, telegram_id, username, password=None, **extra_fields):
        if not telegram_id:
            raise ValueError('The Telegram ID must be set')
        if not username:
            raise ValueError('The username must be set')

        # Создаем пользователя с заданными полями
        extra_fields.setdefault('is_active', True)
        user = self.model(telegram_id=telegram_id, username=username, **extra_fields)
        user.set_password(password)
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
    username = models.CharField(max_length=255, unique=True)
    first_name = models.CharField(max_length=255, null=True, blank=True)
    last_name = models.CharField(max_length=255, null=True, blank=True)
    photo_url = models.URLField(max_length=1024, null=True, blank=True)
    auth_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    ton_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    dogs_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    platinum_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    gold_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_superuser = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['telegram_id']  # Поля, которые необходимо запросить при создании суперпользователя

    def __str__(self):
        return f"{self.first_name} {self.last_name}"
