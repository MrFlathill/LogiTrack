import boto3
import re
import phonenumbers
from openai import OpenAI

# custom function for OpenAI GPT-4 preview api
def chat(system, user_assistant):
    assert isinstance(system, str), "`system` should be a string"
    assert isinstance(user_assistant, list), "`user_assistant` should be a list"
    system_msg = [{"role": "system", "content": system}]
    user_assistant_msgs = [
        {"role": "assistant", "content": user_assistant[i]} if i % 2 else {"role": "user", "content": user_assistant[i]}
        for i in range(len(user_assistant))]

    msgs = system_msg + user_assistant_msgs
    response = aiclient.chat.completions.create(model="gpt-4-1106-preview",messages=msgs)
    print(response)
    status_code = response.choices[0].finish_reason
    assert status_code == "stop", f"The status code was {status_code}."
    return response.choices[0].message.content

# custom function for AWS reckognition image to text API
def detect_text(image_path):
    # Create a Rekognition client
    rekognition = boto3.client('rekognition')

    # Open the image file
    with open(image_path, 'rb') as image_file:
        # Read the image file as bytes
        image_bytes = image_file.read()

        # Use the detect_text API to extract text from the image
        response = rekognition.detect_text(Image={'Bytes': image_bytes})

        results = []
        for item in response['TextDetections']:
            results.append(item['DetectedText'])
            # print(item['DetectedText'])
        return results

# custom function to detect truck manufacturer
def detect_manufacturer(text):
    with open('manufacturers.txt') as my_file:
        manufacturers = [line.rstrip() for line in my_file]
        if text.upper() in map(str.upper, manufacturers):
            return text

# custom function to detect emails
def detect_email(text):
    pattern_match_re = r'([A-Za-z0-9_.-]+)@([A-Za-z0-9_]+\.)+([A-Za-z]{2,4})'
    matches = re.findall("(" + pattern_match_re + ")", text, re.IGNORECASE)
    for match in matches:
        for m in match:
            if len(m) > 0:
                    return m

# custom function to detect addresses
def detect_address(text):
    pattern_match_re = r'\d{1,5}\s\w.\s(\b\w*\b\s){1,2}\w*\.'
    matches = re.findall("(" + pattern_match_re + ")", text, re.IGNORECASE)
    for match in matches:
        #print(match)
        for m in match:
            if len(m) > 0:
                    return m

# custom function to detect phone numbers
def detect_phonenumber(text):
    # Make potential phone numbers more friendly to parse
    content = text.replace('.', '-')
    myres = []
    for match in phonenumbers.PhoneNumberMatcher(content, region="IT"):
        n = phonenumbers.format_number(match.number, phonenumbers.PhoneNumberFormat.E164)
        myres.append(n)
    if len(myres) == 0:
        return None
    else:
        return myres


def detect_company(text):
    # credits https://github.com/smicallef/spiderfoot/blob/master/modules/sfp_company.py
    # Various ways to identify companies in text
    # Support up to three word company names with each starting with
    # a capital letter, allowing for hyphens brackets and numbers within.
    #pattern_prefix = r"(?=[,;:\'\">\(= ]|^)\s?([A-Z0-9\(\)][A-Za-z0-9\-&,\.][^ \"\';:><]*)?\s?([A-Z0-9\(\)][A-Za-z0-9\-&,\.]?[^ \"\';:><]*|[Aa]nd)?\s?([A-Z0-9\(\)][A-Za-z0-9\-&,\.]?[^ \"\';:><]*)?\s+"
    pattern_prefix = r"(.*)"
    pattern_match_re = [
        'LLC', r'L\.L\.C\.?', 'AG', r'A\.G\.?', 'GmbH', r'Pty\.?\s+Ltd\.?',
        r'Ltd\.?', r'Pte\.?', r'Inc\.?', r'INC\.?', 'Incorporated', 'Foundation',
        r'Corp\.?', 'Corporation', 'SA', r'S\.A\.?', 'SIA', 'BV', r'B\.V\.?',
        'NV', r'N\.V\.?', 'PLC', 'Limited', r'Pvt\.?\s+Ltd\.?', 'SARL',
        'Srl', r'S\.R\.L\.?', 'SRL', 'Spa', 'SPA', r'S\.P\.A\.?']
    pattern_match = [
        'LLC', 'L.L.C', 'AG', 'A.G', 'GmbH', 'Pty',
        'Ltd', 'Pte', 'Inc', 'INC', 'Foundation',
        'Corp', 'SA', 'S.A', 'SIA', 'BV', 'B.V',
        'NV', 'N.V', 'PLC', 'Limited', 'Pvt.', 'SARL',
        'Srl', 'SRL', 'S.R.L.']

    pattern_suffix = r"(?=[ \.,:<\)\'\"]|[$\n\r])"
    # Filter out anything from the company name which matches the below
    filterpatterns = [
        "Copyright",
        r"\d{4}"  # To catch years
    ]

    myres = None
    for pat in pattern_match_re:
        matches = re.findall(pattern_prefix + "(\ " + pat + ")", text, re.MULTILINE | re.IGNORECASE)
        for match in matches:
            matched = 0
            for m in match:
                if len(m) > 0:
                    matched += 1
            if matched <= 1:
                continue
            fullcompany = ""
            for m in match:
                flt = False
                for f in filterpatterns:
                    if re.match(f, m):
                        flt = True
                if not flt:
                    fullcompany += m + " "

            fullcompany = re.sub(r"\s+", " ", fullcompany.strip())

            #print("Found company name: " + fullcompany)

            if fullcompany == myres:
                #print("Already found from this source.")
                continue

            myres = fullcompany
    if not myres:
        return None
    else:
        return myres

# Proof of value

# OpenAI init
aiclient = OpenAI(api_key="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")
confidence_level = 95

#AWS Rekognition init
session = boto3.Session(profile_name='default') 
client = session.client('rekognition')

# image loading from filesystem. TODO mysql integration
image_name="image7.jpg"
image_path = "/opt/pictures/"+image_name

# image processing and label extraction through AWS Rekognition
# and custom regex
metadata = lambda: None
metadata.phone = []
labels = detect_text(image_path)
for label in labels:
    if (res := detect_manufacturer(label)) is not None:
        metadata.manufacturer = res
    if (res := detect_company(label)) is not None:
        metadata.company = res
    if (res := detect_email(label)) is not None:
        metadata.email = res
    if (res := detect_phonenumber(label)) is not None:
        metadata.phone += res
    if (res := detect_address(label)) is not None:
        metadata.address = res
#if hasattr(metadata, "manufacturer"): print(metadata.manufacturer)
#if hasattr(metadata, "company"): print(metadata.company)
#if hasattr(metadata, "email"): print(metadata.email)
#if hasattr(metadata, "phone"): print(metadata.phone)
#if hasattr(metadata, "address"): print(metadata.address)

# prompt init for OpenAI data enrichment
print(labels)
print("")
prompt = f"""
Le informazioni di seguito sono state estratte da una immagine di un camion:  \"{labels}\".
Identifica l'azienda di appartenenza del camion piu probabile, dammi solo un risultato.
Restituisci anche informazioni riguardanti:
- la ragione sociale dell'azienda
- l'indirizzo della sede legale
- un numero di telefono di contatto
- una email di contatto
Il formato della risposta deve essere json, con solo le risposte alle mie domande e nient'altro, ti fornisco di seguito un esempio:
{{
    "ragione_sociale": "inserisci qui la ragione sociale",
    "indirizzo": "inserisci qui l'indirizzo della sede legale",
    "telefono": "inserisci qui il numero di telefono",
    "email": "inserisci qui la email di contatto"
}}
"""
print(prompt)
response = chat("You are a sales specialist.", [prompt])

# results display. TODO mysql integration
print(response)