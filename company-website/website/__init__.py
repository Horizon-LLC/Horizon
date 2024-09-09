from flask import Flask

def create_app():
    app = Flask(__name__, template_folder="template")
    app.config['SECRET_KEY'] = 'LY7PmC0LimDVZx9tycCa'

    from .views import views

    app.register_blueprint(views, url_prefix='/')


    return app


