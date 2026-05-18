from pypdf import PdfReader

def extract_text_from_pdf(pdf_path):
        """
        Extract text page by page from PDF.
        """

        reader = PdfReader(pdf_path)

        full_text = ""

        pages_extracted = 0

        for page in reader.pages:

            text = page.extract_text()

            if text:
                full_text += text + "\n"
                pages_extracted += 1

        return {
            "text": full_text,
            "pages_extracted": pages_extracted
        }