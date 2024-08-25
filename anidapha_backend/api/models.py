from django.db import models, transaction
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin, AbstractUser
from django.utils import timezone

from farm.models import Seed
from colorful.fields import RGBColorField


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
    objects = UserManager()
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
    count_purchases = models.IntegerField(default=0)
    last_daily_reward = models.DateTimeField(null=True, blank=True)  # Поле для хр
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_superuser = models.BooleanField(default=False)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['telegram_id']

    def save(self, *args, **kwargs):
        if self.auth_date and timezone.is_naive(self.auth_date):
            self.auth_date = timezone.make_aware(self.auth_date)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class Item(models.Model):
    ITEM_TYPES = [
        ('weapon', 'Weapon'),
        ('armor', 'Armor'),
        ('helmet', 'Helmet'),
        ('shield', 'Shield'),
        ('boots', 'Boots'),
        ('pants', 'Pants'),
        ('gloves', 'Gloves'),
        ('ring', 'Ring'),
        ('amulet', 'Amulet'),
        ('accessory', 'Accessory'),
        ('potion', 'Potion'),
        ('scroll', 'Scroll'),
        ('material', 'Material'),
        ('quest_item', 'Quest Item'),
        ('stone','Stone'),
        ('other', 'Other'),
    ]
    RARITY_CHOICES = [
        ('common', 'Common'),
        ('uncommon', 'Uncommon'),
        ('rare', 'Rare'),
        ('epic', 'Epic'),
        ('legendary', 'Legendary'),
    ]

    name = models.CharField(max_length=100, verbose_name="Название")
    creator = models.CharField(max_length=100, default='admin', verbose_name="Создатель")
    owner = models.ForeignKey('User', on_delete=models.CASCADE, related_name='items', verbose_name="Владелец")
    item_type = models.CharField(max_length=20, choices=ITEM_TYPES, verbose_name="Тип")
    attack = models.IntegerField(default=0, verbose_name="Атака", null=True, blank=True)
    defense = models.IntegerField(default=0, verbose_name="Броня", null=True, blank=True)
    accuracy = models.IntegerField(default=0, verbose_name="Точность", null=True, blank=True)
    evasion = models.IntegerField(default=0, verbose_name="Уворот", null=True, blank=True)
    stun = models.IntegerField(default=0, verbose_name="Оглушение", null=True, blank=True)
    block = models.IntegerField(default=0, verbose_name="Блок", null=True, blank=True)
    health = models.IntegerField(default=0, verbose_name="Жизни", null=True, blank=True)
    price = models.FloatField(default=0.0, verbose_name="Цена")
    unique_properties = models.CharField(max_length=255, blank=True, verbose_name="Уникальные свойства")
    image = models.ImageField(upload_to='images/', blank=True, null=True, verbose_name="Изображение")
    rarity = models.CharField(max_length=10, choices=RARITY_CHOICES, default='common')

    def __str__(self):
        return self.name


from django.db import models


class InventoryItem(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='inventory')
    item = models.ForeignKey(Item, on_delete=models.CASCADE, null=True, blank=True)
    seed = models.ForeignKey(Seed, on_delete=models.CASCADE, null=True, blank=True)
    quantity = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    type = models.CharField()

    def __str__(self):
        return f"InventoryItem for {self.owner.username}"


class Plot(models.Model):
    user = models.ForeignKey('api.User', on_delete=models.CASCADE)
    plot_id = models.AutoField(primary_key=True)
    plant_name = models.CharField(max_length=255, blank=True, null=True, default='EMPTY')
    texture_url = models.CharField(max_length=255, blank=True, null=True, default='images/grunt.webp')
    planted_at = models.DateTimeField(blank=True, null=True, default=None)
    seed = models.ForeignKey(Seed, on_delete=models.SET_NULL, null=True, blank=True, default=None)

    def is_empty(self):
        return self.seed is None

    def plant_seed(self, seed):
        if not self.is_empty():
            raise ValueError("This plot is already occupied.")

        # Уменьшаем количество семян в инвентаре
        inventory_item = InventoryItem.objects.filter(user=self.user, seed=seed).first()
        if not inventory_item or inventory_item.quantity < 1:
            raise ValueError("Insufficient seeds in inventory.")

        inventory_item.quantity -= 1
        if inventory_item.quantity == 0:
            inventory_item.delete()
        else:
            inventory_item.save()

        # Сажаем семя
        self.seed = seed
        self.plant_name = seed.name
        self.texture_url = f"/images/seeds/{seed.id}.webp"
        self.planted_at = timezone.now()
        self.save()

    def harvest(self):
        if self.is_empty():
            raise ValueError("This plot is empty.")

        harvested_seed = self.seed

        # Добавляем собранное семя в инвентарь
        inventory_item, created = InventoryItem.objects.get_or_create(user=self.user, seed=harvested_seed)
        inventory_item.quantity += 1
        inventory_item.save()

        # Очистка грядки
        self.seed = None
        self.plant_name = None
        self.texture_url = None
        self.planted_at = None
        self.save()

        return harvested_seed

    def __str__(self):
        return f"Plot {self.plot_id} for {self.user.username}"









class Resource(models.Model):
    RESOURCE_TYPES = [
        ('stone', 'Stone'),
        ('iron', 'Iron'),
        ('wood', 'Wood'),
        ('gold', 'Gold'),
        ('silver', 'Silver'),
        ('copper', 'Copper'),
        ('platinum', 'Platinum'),
        ('crystal', 'Crystal'),
        ('herb', 'Herb'),
        ('gemstone', 'Gemstone'),
        ('fabric', 'Fabric'),
        ('leather', 'Leather'),
        ('bone', 'Bone'),
        ('clay', 'Clay'),
        ('other', 'Other'),
    ]

    INITIAL_RARITY = {
        'stone': 'common',
        'wood': 'common',
        'iron': 'common',
        'copper': 'uncommon',
        'silver': 'uncommon',
        'gold': 'rare',
        'crystal': 'rare',
        'platinum': 'epic',
        'gemstone': 'epic',
        'herb': 'uncommon',
        'fabric': 'common',
        'leather': 'common',
        'bone': 'common',
        'clay': 'common',
        'other': 'common',
    }

    RARITY_CHOICES = [
        ('common', 'Common'),
        ('uncommon', 'Uncommon'),
        ('rare', 'Rare'),
        ('epic', 'Epic'),
        ('legendary', 'Legendary'),
    ]

    name = models.CharField(max_length=100, verbose_name="Название")
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='resources', verbose_name="Владелец")
    resource_type = models.CharField(max_length=20, choices=RESOURCE_TYPES, verbose_name="Тип ресурса")
    rarity = models.CharField(max_length=10, choices=RARITY_CHOICES, verbose_name="Редкость", default='common')
    description = models.TextField(blank=True, verbose_name="Описание")
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, verbose_name="Цена")
    items_created = models.ManyToManyField('Item', related_name='resources_used', blank=True, verbose_name="Что можно создать")
    image = models.ImageField(upload_to='images/resources/', blank=True, null=True, verbose_name="Изображение")
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        # Устанавливаем начальную редкость на основе типа ресурса
        if not self.pk:  # Проверка на создание нового объекта
            self.rarity = self.INITIAL_RARITY.get(self.resource_type, 'common')
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name}"










