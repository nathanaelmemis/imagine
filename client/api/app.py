from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
import base64
from clipper import Clipper

app = Flask(__name__)
cors = CORS(app, 
     origins=['http://localhost:5173/'],
     methods=["GET", "POST"],
     allow_headers=["Content-Type", "Authorization"],
     supports_credentials=True)
cors.init_app(app)  

@app.route("/class_options", methods=['GET'])
@cross_origin()
def class_options():
    with open('classes.txt', 'r') as file:
        return file.read().strip().split('\n')

@app.route("/generate", methods=['POST'])
@cross_origin()
def generate():
    # extract query from packet
    # convert to lowercase & split by spaces
    query = request.get_json().get('query').lower().split(' ')

    # return error if no query in packet
    if not query:
        return 400
    
    # apply clipping to query
    clipper = Clipper()
    recognized_word = clipper(query)

    # return error empty array if no recognized word or synonyms in classes
    if not recognized_word:
        return jsonify({"imageUrls": []}) 

    # log if valid query
    print('Generating images for query:', recognized_word)

    # ML model process starts here

    # sample data
    generatedImages = []
    with open('sample_images/c1.jpg', 'rb') as image_file:
        generatedImages += ([image_file.read()] * 8)
    with open('sample_images/c2.jpg', 'rb') as image_file:
        generatedImages += ([image_file.read()] * 8)

    imageUrls = []
    # convert images to image URLs
    for image in generatedImages:
        encoded_image = base64.b64encode(image).decode('utf-8')
        mime_type = 'image/jpg'
        imageUrls.append(f'data:{mime_type};base64,{encoded_image}')

    return jsonify({'imageUrls': imageUrls}) # array(16) of image URLs

if __name__ == '__main__':
    app.run(debug=True)