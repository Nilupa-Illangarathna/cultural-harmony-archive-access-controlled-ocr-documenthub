from PIL import Image
import pytesseract

def ocr_image(input_path, output_path):
    # Set the path to the Tesseract executable
    pytesseract.pytesseract.tesseract_cmd = r'E:\Tesseract OCR\tesseract.exe'

    # Read the input image using Pillow
    image = Image.open(input_path)

    # Specify multiple languages for OCR (comma-separated)
    languages = 'eng+sin+tam'

    # Perform OCR using Tesseract with multiple languages
    text = pytesseract.image_to_string(image, lang=languages)

    # Save the extracted text to a text file
    with open(output_path, 'w', encoding='utf-8') as text_file:
        text_file.write(text)

if __name__ == "__main__":
    input_image_path = '/input/image.png'
    output_text_path = '/output/ocr_text.txt'
    ocr_image(input_image_path, output_text_path)
