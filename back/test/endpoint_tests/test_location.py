from boxtribute_server.enums import BoxState


def test_location(client, default_boxes, default_location):
    query = f"""query {{
                location(id: "{default_location['id']}") {{
                    id
                    base {{
                        id
                    }}
                    name
                    isShop
                    boxes {{
                        elements {{
                            id
                        }}
                    }}
                    boxState
                    createdOn
                    createdBy {{
                        id
                    }}
                }}
            }}"""
    data = {"query": query}
    response_data = client.post("/graphql", json=data)
    queried_location = response_data.json["data"]["location"]
    assert queried_location == {
        "id": str(default_location["id"]),
        "base": {"id": str(default_location["base"])},
        "name": default_location["name"],
        "isShop": default_location["is_shop"],
        "boxes": {"elements": [{"id": str(b["id"])} for b in default_boxes]},
        "boxState": BoxState(default_location["box_state"]).name,
        "createdOn": None,
        "createdBy": {"id": str(default_location["created_by"])},
    }

    query = """query {
                locations {
                    name
                }
            }"""
    data = {"query": query}
    response_data = client.post("/graphql", json=data)
    queried_location = response_data.json["data"]["locations"][0]
    assert queried_location["name"] == default_location["name"]
