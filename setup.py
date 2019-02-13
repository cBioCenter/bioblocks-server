from setuptools import setup, find_packages

setup(
    name='bioblocks_server',
    version='0.0.1',
    description='Backend webserver for BioBlocks',
    url='',
    author='Nicholas Gauthier',

    classifiers=[
        'License :: MIT License',
    ],

    keywords='rest restful api flask swagger openapi flask-restplus',

    packages=find_packages(),
)
