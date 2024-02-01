from PIL import Image
import pytesseract

# Set the path to the Tesseract executable
pytesseract.pytesseract.tesseract_cmd = r'E:\Tesseract OCR\tesseract.exe'

# Read the input image using Pillow
image_path = 'input.png'
image = Image.open(image_path)

# Specify multiple languages for OCR (comma-separated)
languages = 'eng+sin+tam'

# Perform OCR using Tesseract with multiple languages
text = pytesseract.image_to_string(image, lang=languages)

# # Save the extracted text to a text file
# text_output_path = 'output.txt'
# with open(text_output_path, 'w', encoding='utf-8') as text_file:
#     text_file.write(text)

print(f"Text output saved to {text_output_path}")

# Save the extracted text to a text file
with open('output\\ocr_text.txt', 'w', encoding='utf-8') as text_file:
    text_file.write(text)
