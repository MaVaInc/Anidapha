from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin, AbstractUser
from django.utils import timezone


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
    def save(self, *args, **kwargs):
        if self.auth_date and timezone.is_naive(self.auth_date):
            self.auth_date = timezone.make_aware(self.auth_date)
        super().save(*args, **kwargs)
    def __str__(self):
        return f"{self.first_name} {self.last_name}"



class Item(models.Model):
    ITEM_TYPES = [
        ('weapon', 'Weapon'),  # Оружие
        ('armor', 'Armor'),  # Броня
        ('helmet', 'Helmet'),  # Шлем
        ('shield', 'Shield'),  # Щит
        ('boots', 'Boots'),  # Ботинки
        ('gloves', 'Gloves'),  # Перчатки
        ('ring', 'Ring'),  # Кольцо
        ('amulet', 'Amulet'),  # Амулет
        ('belt', 'Belt'),  # Пояс
        ('accessory', 'Accessory'),  # Аксессуар
        ('potion', 'Potion'),  # Зелье
        ('scroll', 'Scroll'),  # Свиток
        ('material', 'Material'),  # Материал для крафта
        ('quest_item', 'Quest Item'),  # Квестовый предмет
        ('other', 'Other'),  # Другие предметы
    ]

    name = models.CharField(max_length=100, verbose_name="Название")
    creator = models.CharField(max_length=100,default='admin', verbose_name="Создатель")
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='items', verbose_name="Владелец")
    item_type = models.CharField(max_length=20, choices=ITEM_TYPES, verbose_name="Тип")
    attack = models.IntegerField(default=0, verbose_name="Атака")
    defense = models.IntegerField(default=0, verbose_name="Броня")
    accuracy = models.IntegerField(default=0, verbose_name="Точность")
    evasion = models.IntegerField(default=0, verbose_name="Уворот")
    stun = models.IntegerField(default=0, verbose_name="Оглушение")
    block = models.IntegerField(default=0, verbose_name="Блок")
    health = models.IntegerField(default=0, verbose_name="Жизни")
    price = models.FloatField(default=0.0, verbose_name="Цена")
    unique_properties = models.CharField(max_length=255, blank=True, verbose_name="Уникальные свойства")
    image = models.ImageField(upload_to='item_images/', blank=True, null=True, verbose_name="Изображение")

    def __str__(self):
        return self.name
