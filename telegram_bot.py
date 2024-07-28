import asyncio
from telegram import BotCommand, WebAppInfo, KeyboardButton, ReplyKeyboardMarkup, Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes

# Ваш API токен и URL веб-приложения
TOKEN = '7234439409:AAG6HEzoTVX5kjZbqdUcT5alJ15NuId1hDM'
WEB_APP_URL = 'https://anidapha.com'


# Функция для создания кнопки с веб-приложением
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    user_id = update.message.chat_id
    print(f"User ID: {user_id}")
    # Создаем кнопку для запуска веб-приложения
    web_app_button = KeyboardButton(text="Open", web_app=WebAppInfo(url=WEB_APP_URL))
    keyboard = [[web_app_button]]
    reply_markup = ReplyKeyboardMarkup(keyboard, resize_keyboard=True)

    # Отправляем сообщение для установки клавиатуры
    await update.message.reply_text("Press the button below to open the Web App:", reply_markup=reply_markup)


async def main() -> None:
    # Создаем экземпляр Application
    application = Application.builder().token(TOKEN).build()

    # Установка команды /start
    application.add_handler(CommandHandler("start", start))

    # Запускаем бота
    await application.initialize()
    await application.start()

    print("Bot started. Press Ctrl+C to stop.")
    await application.updater.start_polling()

    # Ожидание сигнала завершения
    await asyncio.Future()  # Блокировка на неопределенное время


if __name__ == '__main__':
    try:
        asyncio.run(main())
    except (KeyboardInterrupt, SystemExit):
        print("Bot stopped.")
