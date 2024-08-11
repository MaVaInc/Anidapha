from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db.models.signals import post_save
from django.dispatch import receiver


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
    objects = UserManager()

    USERNAME_FIELD = 'telegram_id'

    def __str__(self):
        return self.username




class Seed(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    grow_time = models.DurationField()
    rarity = models.CharField(max_length=50)
    description = models.TextField()
    applied_to = models.JSONField(default=list)

    def __str__(self):
        return f"{self.name} ({self.rarity})"


class Plot(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    plot_id = models.IntegerField()  # Идентификатор поля (0-5)
    plant_name = models.CharField(max_length=255, null=True, blank=True)
    texture_url = models.CharField(max_length=255, null=True, blank=True)
    planted_at = models.DateTimeField(null=True, blank=True)

    def is_empty(self):
        return self.plant_name is None

    def __str__(self):
        return f"Plot {self.plot_id} - {self.plant_name}" if self.plant_name else f"Plot {self.plot_id} - Empty"

def create_user_plots(sender, instance, created, **kwargs):
    if created:
        for i in range(6):  # создаем 6 полей для каждого пользователя
            Plot.objects.create(user=instance, plot_id=i)


