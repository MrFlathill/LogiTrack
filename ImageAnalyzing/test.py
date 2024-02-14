# Use local image file and upload it to chatgpt for analyzing

import base64
from openai import OpenAI
from dotenv import dotenv_values


def encode_image(image_path):
    with open(image_path, 'rb') as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

# Import Env Variables
env = dotenv_values(".env")

# Initialize OpenAI API with my API_KEY
client = OpenAI(api_key=env["OPENAI_API_KEY"])

# Convert picture to base64 string
base64_image = encode_image(env["PICTURE_PATH"])

prompt = '''
Im folgendem Bild ist ein LKW zu sehen. Identifiziere das Unternehmen, dem der LkW höchstwahrscheinlich gehört, und gib mir nur ein Ergebnis.\
Gib auch Informationen über:
- das Kennzeichen das im Bild zu erkennen ist
- den Rechtlichen Namen des Unternehmens
- die Anschrift des eingetragenen Sitzes
- eine Telefonnummer für die Kontaktaufnahme
- eine Kontakt-E-Mail 

Gib die Informationen in folgendem Format wieder:
{
    "numbers_plate": "Gib hier das Kennzeichen des LKWs ein" 
    "company-name": "Gib hier den Namen des Unternehmens ein", 
    "address": "Gib hier den Firmensitz ein", 
    "telefone": "Gib hier die Telefonnummer des Unthernehmens ein", 
    "email": "Gib hier die Email des Unthernehmens ein" 
}
'''


response = client.chat.completions.create(
    model='gpt-4-vision-preview',
    messages=[
        {
            'role': 'user',
            'content': [
                {
                    'type': 'text',
                    'text': prompt,
                },
                {
                    'type': 'image_url',
                    'image_url': {
                        'url': f'data:image/jpeg;base64,{base64_image}',
                        #'detail': 'high',
                    },
                },
            ],
        }
    ],
    max_tokens=400,
)

print('Completion Tokens:', response.usage.completion_tokens)
print('Prompt Tokens:', response.usage.prompt_tokens)
print('Total Tokens:', response.usage.total_tokens)
#print(response.choices[0].message)
print(response.choices[0])


