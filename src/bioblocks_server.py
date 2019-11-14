import os
import sys
from eve import Eve
from flask import request, Response, send_from_directory
from flask_cors import CORS
from os.path import dirname
from src import settings
from src.bb_schema import instantiation
from src.data import UUIDEncoder, UUIDValidator

static_folder = '{0}/../files'.format(
    os.path.dirname(os.path.abspath(__file__))
)
template_folder = '{0}/../templates'.format(
    os.path.dirname(os.path.abspath(__file__))
)

sys.path.append(dirname(__file__) + '/../files/spring/cgi-bin')


def handle_spring_cgi(filename):
    cgi_location = '{0}/spring/cgi-bin/{1}'.format(static_folder, filename)
    with open(cgi_location) as f:
        import cgi
        code = compile(f.read(), filename, 'exec')
        cgi_params = request.form.to_dict()

        if 'base_dir' in cgi_params:
            cgi_params['base_dir'] = '{0}/{1}'.format(static_folder, cgi_params['base_dir'])

        if 'sub_dir' in cgi_params:
            cgi_params['sub_dir'] = '{0}/{1}'.format(static_folder, cgi_params['sub_dir'])

        def get_cgi_param(self, key):
            return cgi_params[key]

        cgi.FieldStorage = type('', (object,), {
            'getvalue': get_cgi_param
        })

        def exec_cgi_script():
            from io import StringIO
            old_stdout = sys.stdout
            redirected_output = sys.stdout = StringIO()
            try:
                exec(code, globals(), cgi_params)
            except Exception:
                raise
            finally:
                sys.stdout = old_stdout

            result = redirected_output.getvalue()
            return result

        return Response(exec_cgi_script())


def create_app(settings=settings.get_bioblocks_settings()):
    EveApp = Eve(json_encoder=UUIDEncoder.UUIDEncoder, settings=settings,
                 static_folder=static_folder, template_folder=template_folder,
                 validator=UUIDValidator.UUIDValidator)
    CORS(EveApp)

    @EveApp.route('/js/<filename>')
    def static_javascript(filename):
        return send_from_directory(static_folder, 'staticjs/{0}'.format(filename))

    @EveApp.route('/spring/springViewer.html')
    def spring_index():
        return send_from_directory(static_folder, 'spring/springViewer.html')

    @EveApp.route('/spring/datasets/<path:filename>')
    @EveApp.route('/datasets/<path:filename>')
    def spring_dataset_files(filename):
        return send_from_directory('{}/datasets'.format(static_folder), filename)

    @EveApp.route('/spring/cgi-bin/<path:filename>', methods=['GET', 'POST'])
    def spring_cgi_bin(filename):
        if request.method == 'POST':
            return handle_spring_cgi(filename)
        else:
            return send_from_directory('{}/spring/cgi-bin/'.format(static_folder), filename)

    @EveApp.route('/spring/<path:filename>')
    def spring_files(filename):
        return send_from_directory('{}/spring'.format(static_folder), filename)

    return EveApp


app = create_app()

# Set Environment Configuration
# Default is 'development'. Other valid values: 'testing' and 'production'
# To change, change FLASK_ENV the .env file at the root of the project
if app.config['ENV'] == 'production':
    app.config.from_object('config.ProductionConfig')
elif app.config['ENV'] == 'development':
    app.config.from_object('config.DevelopmentConfig')
elif app.config['ENV'] == 'testing':
    app.config.from_object('config.TestingConfig')
else:
    raise Exception(
        'Invalid FLASK_ENV specified "{0}".'.format(app.config['ENV'])
    )

#print('{0}/config.py'.format( os.path.dirname(os.path.abspath(__file__))))
# app.config.from_object('config.ProductionConfig')
#print('FLASK_ENV is set to {0}'.format(app.config['ENV']))

app.on_insert_instantiation += instantiation.handle_on_insert_instantiation
app.on_post_POST_instantiation += instantiation.handle_on_post_POST_instantiation

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=11037, threaded=True)
