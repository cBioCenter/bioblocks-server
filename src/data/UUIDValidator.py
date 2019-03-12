from eve.io.mongo import Validator
from uuid import UUID


class UUIDValidator(Validator):
    """
    Extends the base mongo validator adding support for the uuid data-type
    """

    def _validate_type_uuid(self, value):
        try:
            uuid = UUID(value)
            if isinstance(uuid, UUID):
                return True
        except ValueError:
            pass
