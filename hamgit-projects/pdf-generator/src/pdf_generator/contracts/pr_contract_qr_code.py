import os

import qrcode
from PIL import Image, ImageDraw
import io
from pathlib import Path
import base64

from qrcode.image.styledpil import StyledPilImage
from qrcode.image.styles.colormasks import SolidFillColorMask, ImageColorMask
from qrcode.image.styles.moduledrawers import GappedSquareModuleDrawer, RoundedModuleDrawer, VerticalBarsDrawer


def generate_qr_code(id: str | int, password: str | int):
    qr = qrcode.QRCode(
        version=1,  # Size of the QR Code
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=0
    )

    drawer = GappedSquareModuleDrawer(size_ratio=0.5)

    qr.add_data(f"https://app.amline.ir/contracts/inquiry/{id}/{password}")  # Replace with your desired data
    qr.make(fit=True)

    current_dir = os.path.dirname(__file__)
    root_path_ = Path(current_dir).parent

    qr_img = qr.make_image(
        module_drawer=drawer,

        color_mask=SolidFillColorMask(back_color=(255, 255, 255)),
        embeded_image_path=root_path_.joinpath('assets/images/watermark.png'),
        embeded_image_ratio=1,
        # color_mask=ImageColorMask(color_mask_path=root_path_.joinpath('assets/images/watermark.png')),
        image_factory=StyledPilImage,
    ).convert('RGBA')

    buffered = io.BytesIO()
    qr_img.save(buffered, format="PNG")

    img_base64 = base64.b64encode(buffered.getvalue()).decode('utf-8')

    return img_base64
