# import nltk

# nltk.data.path = ['nltk_data/corpora/wordnet']

# from nltk.corpus import wordnet

class Clipper:
    '''
        returns matched word or synonym, else empty string
    '''
    def __init__(self, classes_file='classes.txt'):
        # load classes from text file
        with open(classes_file, 'r') as file:
            self.classes = file.read().strip().split('\n')
            
    def __call__(self, query):
        # find the first word that has match within classes
        return self._check_word_array_in_classes(query, self.classes)

        # # if no match in classes get synonyms
        # if recognized_word:
        #     return recognized_word
        
        # for word in query:
        #     synonyms = self._get_synonyms(word)
        #     # check if any synonym matches in classes
        #     recognized_word = self._check_word_array_in_classes(synonyms, self.classes)
        #     if recognized_word:
        #         return recognized_word
            
        return ''

    def _check_word_array_in_classes(self, word_array, classes):
        for word in word_array:
            if word in classes:
                return word
        return ''

    # def _get_synonyms(self, word):
    #     synonyms = []

    #     synsets = wordnet.synsets(word)
        
    #     for synset in synsets:
    #         for lemma in synset.lemmas():
    #             synonyms.append(lemma.name())

    #     return synonyms
