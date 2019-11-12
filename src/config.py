class Config(object):
    DEBUG = False
    TESTING = False
    BB_ORIGIN = 'http://0.0.0.0:11037'
    BB_APPS_ORIGIN = 'http://0.0.0.0:11038'

class ProductionConfig(Config):
    BB_ORIGIN = 'https://www.bioblocks.org'
    BB_APPS_ORIGIN = 'https://apps.bioblocks.org'

class DevelopmentConfig(Config):
    DEBUG = True

class TestingConfig(Config):
    TESTING = True
