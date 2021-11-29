from boxtribute_server.models.language import Language


def default_language_data():
    # Should match the actual MySQL data
    return [
        {"code": c, "id": i, "rtl": 0}
        for i, c in enumerate(["nl", "en", "fr", "de", "ar", "ckb"], start=1)
    ]


def create():
    for entry in default_language_data():
        Language.create(**entry)
