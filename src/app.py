import logging.config

import os, sys
#from flask import Flask, Blueprint
#import settings

from eve import Eve
app = Eve()

if __name__ == '__main__':
    app.run()

