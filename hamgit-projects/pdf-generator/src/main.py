from fastapi import FastAPI
from fastapi.responses import Response

from pdf_generator import PRContractPDFGenerator
from prcontract_request_model import PRContractRequestModel

app = FastAPI()


@app.post("/pdf")
async def generate_pdf(request_model: PRContractRequestModel):
    pdf_generator = PRContractPDFGenerator(
        contract=request_model.contract,
    )

    pdf_content = await pdf_generator.generate()

    return Response(
        content=pdf_content,
        media_type="application/pdf",
        headers={'Content-Disposition': f"attachment; filename=contract-{request_model.contract.id}.pdf"},
    )


@app.get("/sample-pdf")
async def read_root_pdf():
    # with open('./pr_contract/pr-index.html', 'r') as f:
    #     contents = f.read()
    from pdf_generator import sample_data

    pdf_generator = PRContractPDFGenerator(
        contract=sample_data.contract,
    )

    pdf_content = await pdf_generator.generate()

    return Response(
        content=pdf_content,
        media_type="application/pdf",
        headers={'Content-Disposition': f"inline; filename=contract-{sample_data.contract.id}.pdf"},
    )
