import re


class TextGenerator:

    @staticmethod
    def text_generator(text: str, data: dict) -> str:
        return re.sub(r"\{\{(.*?)\}\}", lambda match: data.get(match.group(1).strip(), match.group(0)), text)
