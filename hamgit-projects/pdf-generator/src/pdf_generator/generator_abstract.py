import inspect
import os
from abc import ABC, abstractmethod
from pathlib import Path
from typing import Dict

from weasyprint import HTML, default_url_fetcher
from jinja2 import Environment, FileSystemLoader

from pdf_generator.helpers import gregorian_to_jalali_year, gregorian_to_jalali_date, gregorian_to_jalali_time, separate_number, \
    number_to_persian_ordinal, gregorian_to_jalali_day


class GeneratorAbstract(ABC):
    @property
    def current_dir(self):
        return Path(inspect.getfile(self.__class__)).parent

    @property
    @abstractmethod
    def views_path(self) -> str:
        pass

    @property
    @abstractmethod
    def template_path(self) -> str:
        pass

    @property
    @abstractmethod
    def css_path(self) -> str:
        pass

    @property
    @abstractmethod
    def translations(self):
        pass

    @abstractmethod
    def get_data(self) -> Dict:
        pass

    async def generate(self):
        environment = Environment(loader=FileSystemLoader(os.path.join(self.current_dir, self.views_path)))

        environment.filters["translate"] = self.translations.get
        environment.filters['gregorian_to_jalali_year'] = gregorian_to_jalali_year
        environment.filters['gregorian_to_jalali_date'] = gregorian_to_jalali_date
        environment.filters['gregorian_to_jalali_day'] = gregorian_to_jalali_day
        environment.filters['gregorian_to_jalali_time'] = gregorian_to_jalali_time
        environment.filters['separate_number'] = separate_number
        environment.filters['number_to_persian_ordinal'] = number_to_persian_ordinal

        base_template = environment.get_template(self.template_path)

        css_path = os.path.join(self.current_dir, self.views_path, self.css_path)

        pdf_content = HTML(
            string=base_template.render(**self.get_data()),
        ).write_pdf(stylesheets=[css_path])

        return pdf_content
