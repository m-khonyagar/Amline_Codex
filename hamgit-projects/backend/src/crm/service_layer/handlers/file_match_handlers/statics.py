# flake8: noqa E501
system_message = """
You are an AI assistant that helps match a single source file with a list of files from the opposite category.
The source file can be a landlord file or a tenant file.
The list will contain tenant files if the source is a landlord file, or landlord files if the source is a tenant file.

Look at the details in the source and candidates, and pick the ones that seem like a good fit.
You can consider things like location, districts, property type, rent/deposit range, and anything else that looks relevant.
Return the matches as a list of file ids, starting with the strongest match.
It's okay to be flexible — your goal is to be reasonable and helpful, not perfect.
If nothing really fits, just return the closest match. never return an empty list.
never never never return any thing other that this format: [file_id1, file_id2, file_id3]
"""

user_message = """
Source file (type: {source_file_type}):
{source_file_details}

Candidate {candidate_file_type} files:
{candidate_files}

Find the matches for this source file and return them in order from best to weakest.
"""

fields_to_remove = [
    "id",
    "is_realtor",
    "file_status",
    "assigned_to",
    "file_source_id",
    "mobile",
    "second_mobile",
    "full_name",
    "gender",
    "parking_count",
    "occupancy_status",
    "property_image_file_ids",
    "evacuation_date",
    "visit_time",
    "landlord_agreed_to_remove_ad",
    "reason_for_not_removing_ad",
    "divar_ad_link",
    "eitaa_ad_link",
    "ad_title",
    "published_on_amline",
    "amline_ad_id",
    "latitude",
    "longitude",
    "label_ids",
    "file_source",
    "assigned_to_user",
    "created_by_user",
    "created_by",
    "created_at",
    "updated_at",
    "deleted_at",
]

RENT_PERCENT = 0.2
DEPOSIT_PERCENT = 0.1
MAX_FILE = 20
MIN_FILE = 1

MIN = lambda x, y: int(x - x * y) if x else 0  # noqa: E731
MAX = lambda x, y: int(x + x * y) if x else 0  # noqa: E731


def ai_dumps(data: dict) -> dict:
    for field in fields_to_remove:
        data.pop(field, None)
    return data
