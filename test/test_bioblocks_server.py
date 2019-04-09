import json
import pytest

from src import bioblocks_server, settings


@pytest.fixture(scope='module')
def test_client():
    test_settings = settings.get_bioblocks_settings()
    test_settings['MONGO_DBNAME'] = 'test_db'
    flask_app = bioblocks_server.create_app(test_settings)

    testing_client = flask_app.test_client()

    ctx = flask_app.app_context()
    ctx.push()

    yield testing_client  # this is where the testing happens!

    ctx.pop()


def test_vignette_endpoint(test_client):
    response = test_client.get('/vignette')
    data = json.loads(response.data)
    assert response.status_code == 200
    assert len(data['_items']) == 0


def test_visualization_endpoint(test_client):
    response = test_client.get('/visualization')
    data = json.loads(response.data)
    assert response.status_code == 200
    assert len(data['_items']) == 0


def test_dataset_endpoint(test_client):
    response = test_client.get('/dataset')
    data = json.loads(response.data)
    assert response.status_code == 200
    assert len(data['_items']) == 0


def test_analysis_endpoint(test_client):
    response = test_client.get('/analysis')
    data = json.loads(response.data)
    assert response.status_code == 200
    assert len(data['_items']) == 0


def test_job_endpoint(test_client):
    response = test_client.get('/job')
    data = json.loads(response.data)
    assert response.status_code == 200
    assert len(data['_items']) == 0
