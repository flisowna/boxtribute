import pytest
from boxtribute_server.models.definitions.shipment_detail import ShipmentDetail
from boxtribute_server.models.utils import utcnow
from data.box import (
    another_marked_for_shipment_box_data,
    box_without_qr_code_data,
    marked_for_shipment_box_data,
)
from data.shipment import data as shipment_data
from data.user import default_user_data

TIME = utcnow().replace(tzinfo=None)


def data():
    shipments = shipment_data()
    box_without_qr_code = box_without_qr_code_data()
    marked_for_shipment_box = marked_for_shipment_box_data()
    shippable_box = another_marked_for_shipment_box_data()
    return [
        {
            "id": 1,
            "shipment": shipments[3]["id"],  # sent shipment
            "box": box_without_qr_code["id"],
            "source_product": box_without_qr_code["product"],
            "source_location": box_without_qr_code["location"],
            "created_on": TIME,
            "created_by": default_user_data()["id"],
        },
        {
            "id": 2,
            "shipment": shipments[3]["id"],  # sent shipment
            "box": marked_for_shipment_box["id"],
            "source_product": marked_for_shipment_box["product"],
            "source_location": marked_for_shipment_box["location"],
            "created_on": TIME,
            "created_by": default_user_data()["id"],
        },
        {
            "id": 3,
            "shipment": shipments[0]["id"],  # preparing shipment
            "box": shippable_box["id"],
            "source_product": shippable_box["product"],
            "source_location": shippable_box["location"],
            "created_on": TIME,
            "created_by": default_user_data()["id"],
        },
    ]


@pytest.fixture
def default_shipment_detail():
    return data()[0]


@pytest.fixture
def another_shipment_detail():
    return data()[1]


@pytest.fixture
def prepared_shipment_detail():
    return data()[2]


def create():
    ShipmentDetail.insert_many(data()).execute()
