#!/usr/local/bin/python
import glob
import importlib

from os.path import dirname, basename, isfile

# https://stackoverflow.com/questions/1057431/how-to-load-all-modules-in-a-folder
moduleFilenames = glob.glob(dirname(__file__)+"/bb_schema/*.py")
modules = [basename(f)[:-3] for f in moduleFilenames if isfile(f)
           and not f.endswith('__init__.py')]

requiredProperties = []

jsonPrimitiveTypeForPythonPrimitiveType = {
    'boolean': 'boolean',
    'dict': 'object',
    'float': 'number',
    'integer': 'number',
    'list': 'array',
    'number': 'number',
    'set': 'array',
    'string': 'string'
}

jsonSchemaFieldForPythonField = {
    'maxlength': 'maxLength',
    'minlength': 'minLength',
}


def writeSectionClosing(index, keys, file):
    """ Print closing comma, if more objects exist, and newline - all in one! """
    if index != len(keys) - 1:
        file.write(',')
    file.write('\n')


def writeIndent(count, file):
    for _ in range(count * 2):
        file.write(' ')


def writeFieldSection(objectSchema, key, file, indentLevel, field, fieldIndex):
    isValueString = True
    value = objectSchema[field]
    if field == "type":
        value = jsonPrimitiveTypeForPythonPrimitiveType[value]
    elif field == "required":
        requiredProperties.append(key)
        return
    elif field == "data_relation":
        return
    elif field == "minlength" or field == "maxlength":
        isValueString = False
        field = jsonSchemaFieldForPythonField[field]
    elif field == "schema" and objectSchema["type"] == "list":
        field = "items"
        writeIndent(indentLevel, file)
        file.write('"{}": '.format(field))
        writeObject(objectSchema, "schema", file, indentLevel, fieldIndex)
        return

    writeIndent(indentLevel, file)
    file.write('"{}": '.format(field))
    if isValueString:
        file.write('"{}"'.format(value))
    else:
        file.write('{}'.format(value))

    writeSectionClosing(fieldIndex, objectSchema.keys(), jsonSchemaFile)


def writeObjectSection(schema, file, indentLevel):
    for propertyIndex, key in enumerate(schema):
        print("propertyIndex: {}, key: {}".format(propertyIndex, key))
        writeIndent(indentLevel, file)
        file.write('"{}": '.format(key))
        writeObject(schema, key, file, indentLevel, propertyIndex)


def writeObject(schema, key, file, indentLevel, index):
    file.write("{\n")
    for fieldIndex, field in enumerate(schema[key]):
        print("fieldIndex: {}, field: {}".format(fieldIndex, field))
        writeFieldSection(schema[key], key, file, indentLevel + 1,
                          field, fieldIndex)
    writeIndent(indentLevel, file)
    file.write('}')
    writeSectionClosing(index, schema.keys(), file)


def writeFileHeading(file):
    file.write("{\n")
    writeIndent(1, file)
    file.write('"$id": "bioblocks-server-json",\n')
    writeIndent(1, file)
    file.write(
        '"$schema": "http://json-schema.org/draft-07/schema#",\n')
    writeIndent(1, file)
    file.write('"type": "object",\n')
    writeIndent(1, file)


for schemaName in modules:
    print(schemaName)

    schemaModule = importlib.import_module(
        "bb_schema.{}".format(schemaName))

    jsonSchemaFile = open(schemaName + ".json", "w")
    writeFileHeading(jsonSchemaFile)
    jsonSchemaFile.write('"properties": {\n')
    writeObjectSection(schemaModule.schema, jsonSchemaFile, 2)

    writeIndent(1, jsonSchemaFile)

    jsonSchemaFile.write("},\n")
    writeIndent(1, jsonSchemaFile)
    jsonSchemaFile.write('"required": {}\n'.format(
        requiredProperties).replace("'", '"'))
    jsonSchemaFile.write("}")
