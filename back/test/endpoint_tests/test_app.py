import peewee
import pytest
from auth import create_jwt_payload
from utils import assert_bad_user_input, assert_internal_server_error


def test_base_specific_permissions(client, mocker):
    """Verify that a user can only create beneficiary if base-specific permission
    available. QR codes can be created regardless of any base but for the front-end the
    base-specific distinction is relevant.
    """
    mocker.patch("jose.jwt.decode").return_value = create_jwt_payload(
        organisation_id=2,
        user_id=1,
        permissions=[
            "base_2/qr:create",
            "stock:write",
            "base_3/beneficiary:create",
        ],
    )

    create_beneficiary_for_base2_mutation = """createBeneficiary(
                creationInput : {
                    firstName: "First",
                    lastName: "Last",
                    dateOfBirth: "1990-09-01",
                    baseId: 2,
                    groupIdentifier: "1312",
                    gender: Male,
                    languages: [de],
                    isVolunteer: true,
                    registered: false
                }) {
                id
            }"""
    create_beneficiary_for_base3_mutation = (
        create_beneficiary_for_base2_mutation.replace("baseId: 2", "baseId: 3")
    )
    data = {
        "query": f"""mutation {{
            bene2: {create_beneficiary_for_base2_mutation}
            bene3: {create_beneficiary_for_base3_mutation}
        }}"""
    }

    response = client.post("/graphql", json=data)
    assert response.status_code == 200
    assert response.json["data"]["bene2"] is None
    assert response.json["data"]["bene3"] is not None
    assert len(response.json["errors"]) == 1
    assert response.json["errors"][0]["extensions"]["code"] == "FORBIDDEN"
    assert response.json["errors"][0]["path"] == ["bene2"]

    data = {
        "query": """mutation {
            qr2: createQrCode { code }
            qr3: createQrCode { code }
        }"""
    }
    response = client.post("/graphql", json=data)
    assert response.status_code == 200
    assert response.json["data"]["qr2"] is not None
    assert response.json["data"]["qr3"] is not None
    assert "errors" not in response.json


def test_invalid_pagination_input(read_only_client):
    query = """query { beneficiaries(paginationInput: {last: 2}) {
        elements { id }
    } }"""
    assert_bad_user_input(read_only_client, query, none_data=True)


@pytest.mark.parametrize(
    "resource",
    [
        "beneficiary",
        "location",
        "product",
        "productCategory",
        "shipment",
        "transferAgreement",
    ],
)
def test_query_non_existent_resource(read_only_client, resource):
    # Test cases 2.1.4, 3.1.3
    query = f"query {{ {resource}(id: 0) {{ id }} }}"
    response = assert_bad_user_input(read_only_client, query, field=resource)
    assert "SQL" not in response.json["errors"][0]["message"]


@pytest.mark.parametrize("resource", ["base", "organisation", "user"])
def test_query_non_existent_resource_for_god_user(read_only_client, mocker, resource):
    # Non-god users would not be authorized to access resource ID 0
    mocker.patch("jose.jwt.decode").return_value = create_jwt_payload(permissions=["*"])
    query = f"query {{ {resource}(id: 0) {{ id }} }}"
    response = assert_bad_user_input(read_only_client, query, field=resource)
    assert "SQL" not in response.json["errors"][0]["message"]


@pytest.mark.parametrize(
    "operation",
    [
        "acceptTransferAgreement",
        "rejectTransferAgreement",
        "cancelTransferAgreement",
        "cancelShipment",
        "sendShipment",
    ],
)
def test_mutation_non_existent_resource(read_only_client, operation):
    # Test cases 2.2.4, 2.2.6, 2.2.8, 3.2.8, 3.2.12
    mutation = f"mutation {{ {operation}(id: 0) {{ id }} }}"
    response = assert_bad_user_input(read_only_client, mutation, field=operation)
    assert "SQL" not in response.json["errors"][0]["message"]


@pytest.mark.parametrize(
    "operation",
    [
        "updateBox",
        "updateBeneficiary",
        "updateShipment",
    ],
)
def test_mutation_update_non_existent_resource(read_only_client, operation):
    # Test cases 3.2.21
    if operation == "updateBox":
        update_input = """updateInput: { labelIdentifier: "xxx" }"""
    else:
        update_input = "updateInput: { id: 0 }"
    mutation = f"mutation {{ {operation}({update_input}) {{ id }} }}"
    response = assert_bad_user_input(read_only_client, mutation, field=operation)
    assert "SQL" not in response.json["errors"][0]["message"]


def test_mutation_arbitrary_database_error(read_only_client, mocker):
    mocker.patch(
        "boxtribute_server.graph_ql.resolvers.create_qr_code"
    ).side_effect = peewee.PeeweeException
    mutation = "mutation { createQrCode { id } }"
    assert_internal_server_error(read_only_client, mutation, field="createQrCode")
