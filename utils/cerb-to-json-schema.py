#!/usr/local/bin/python
import glob
import importlib
import os

from os.path import dirname, basename, isfile

# https://stackoverflow.com/questions/1057431/how-to-load-all-modules-in-a-folder
module_filenames = glob.glob(dirname(__file__) + '/../src/bb_schema/*.py')
modules = [basename(f)[:-3] for f in module_filenames
           if isfile(f) and not f.endswith('__init__.py')]

required_properties = []

json_type_for_cerberus_type = {
    'boolean': 'boolean',
    'dict': 'object',
    'float': 'number',
    'integer': 'number',
    'list': 'array',
    'media': 'string',
    'number': 'number',
    'set': 'array',
    'string': 'string',
    'uuid': 'string'
}

json_schema_field_for_python_field = {
    'maxlength': 'maxLength',
    'minlength': 'minLength',
}


def write_section_closing(index, keys, file):
    """ Print closing comma, if more objects exist, and newline - all in one! """
    if index != len(keys) - 1:
        file.write(',')
    file.write('\n')


def write_indent(count, file):
    for _ in range(count * 2):
        file.write(' ')


def write_field_section(object_schema, key, file, indent_level, field, field_index):
    is_value_string = True
    value = object_schema[field]
    if field == 'type':
        value = json_type_for_cerberus_type[value]
    elif field == 'required':
        required_properties.append(key)
        return
    elif field == 'data_relation':
        return
    elif field == 'minlength' or field == 'maxlength':
        is_value_string = False
        field = json_schema_field_for_python_field[field]
    elif field == 'schema' and object_schema['type'] == 'list':
        field = 'items'
        write_indent(indent_level, file)
        file.write('"{}": '.format(field))
        write_object(object_schema, 'schema', file, indent_level, field_index)
        return

    write_indent(indent_level, file)
    file.write('"{}": '.format(field))
    if is_value_string:
        file.write('"{}"'.format(value))
    else:
        file.write('{}'.format(value))

    write_section_closing(field_index, object_schema.keys(), file)


def write_object_section(schema, file, indent_level):
    for property_index, key in enumerate(schema):
        print('propertyIndex: {}, key: {}'.format(property_index, key))
        write_indent(indent_level, file)
        file.write('"{}": '.format(key))
        write_object(schema, key, file, indent_level, property_index)


def write_object(schema, key, file, indent_level, index):
    file.write('{\n')
    for field_index, field in enumerate(schema[key]):
        print('fieldIndex: {}, field: {}'.format(field_index, field))
        write_field_section(schema[key], key, file, indent_level + 1,
                            field, field_index)
    write_indent(indent_level, file)
    file.write('}')
    write_section_closing(index, schema.keys(), file)


def write_file_heading(file):
    write_indent(1, file)
    file.write('"$id": "bioblocks-server-json",\n')
    write_indent(1, file)
    file.write(
        '"$schema": "http://json-schema.org/draft-07/schema#",\n')
    write_indent(1, file)
    file.write('"type": "object",\n')
    write_indent(1, file)


def start_conversion():
    os.mkdir('utils/schema')
    for schema_name in modules:
        schema_module = importlib.import_module(
            'src.bb_schema.{}'.format(schema_name))

        json_schema_file = open(
            'utils/schema/{}.json'.format(schema_name), 'w')
        write_file_heading(json_schema_file)
        json_schema_file.write('"properties": {\n')
        write_object_section(schema_module.schema, json_schema_file, 2)

        write_indent(1, json_schema_file)

        json_schema_file.write('},\n')
        write_indent(1, json_schema_file)
        json_schema_file.write('"required": {}\n'.format(
            required_properties).replace("'", '"'))
        json_schema_file.write('}')


start_conversion()
