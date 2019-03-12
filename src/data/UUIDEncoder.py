from eve.io.base import BaseJSONEncoder
from uuid import UUID


class UUIDEncoder(BaseJSONEncoder):
    """ JSONEconder subclass used by the json render function.
    This is different from BaseJSONEoncoder since it also addresses
    encoding of UUID
    """

    # https://github.com/PyCQA/pylint/issues/414
    def default(self, obj):  # pylint: disable=E0202
        if isinstance(obj, UUID):
            return str(obj)
        else:
            # delegate rendering to base class method (the base class
            # will properly render ObjectIds, datetimes, etc.)
            return super(UUIDEncoder, self).default(obj)
