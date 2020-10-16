# scikit-learn 패키지를 이용하여 tfidf를 구현합니다.
# scikit-learn 패키지를 이용하여 cosine similarity를 계산합니다.
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.metrics.pairwise import euclidean_distances
from sklearn.metrics.pairwise import manhattan_distances
import numpy as np

import re

# tfidf 모델을 로컬에 저장하기 위한 패키지
import pickle


# 학습된 sentencepiece model을 이용하여 data를 tfidf에 이용할 수 있도록 전처리 합니다.
def preprocessing(sentencepiece_model, files, stopwords, Print=False):
    """
    sentencepiece_model : 이미 학습된 sentencepiece_model 객체를 받는 parameter입니다.
    
    files : tfidf에 이용할 file 리스트 입니다. 
    type은 str입니다.
    
    stopwords : 불용언을 답고 있는 리스트 입니다.
    type은 str[]입니다.
    
    Print : 중간 결과를 프린트 할지에 대한 parameter입니다.
    기본값은 False입니다.
    """
    realdata=[]
    for file in files:
        temp_X = sentencepiece_model.EncodeAsPieces(file)
        
        temp_X = [word for word in temp_X if not word in stopwords]
        if (Print):
            print('temp입니다')
            print(temp_X)
            
        file_data=''.join(temp_X)
        file_data = re.sub('▁', '', file_data)
        
        realdata.append(file_data)
        
    if (Print):
        print('실제 사용될 data는 다음과 같습니다')
        for file_data in realdata:
            print(file_data[:20] + '.....')

    return realdata

# tfidf 모델을 학습시킵니다.
def train(data):
    """
    data : 문서의 리스트로 이루어져있어야 합니다.
    """
    tfidfv = TfidfVectorizer().fit(data)
    return tfidfv

# tfidf 분석을 실시합니다.
def do(model, data):
    """
    model : tfidf 분석을 실행할 모델
    
    data : tfidf 분석을 실행할 데이터
    type은 str, str[]입니다.
    """
    result = model.transform(data).toarray()
    return result
    
# pickle 패키지를 이용하여 tfidf모델을 현재 로컬폴더에 저장합니다.
def save(model, name):
    with open(name + '.pk', 'wb') as file:
        pickle.dump(model, file)
        
# pickle 패키지를 이용하여 tfidf모델을 현재 로컬폴더에서 가져옵니다.
# 이름이 같다면 무조건 물러오기 때문에 이 함수는 불러오는 모듈이 tfidf모델인지 체크하지 않습니다.
def load(name):
    with open(name, 'rb') as file:
        return pickle.load(file)

    
# region start 유사도 분석
def cos_similarity(data1, data2, Print=False):
    # 코사인 유사도를 구합니다.
    similarity = cosine_similarity(data1, data2)
    if (Print):
        print('data 1, data 2 Cosine 유사도: {0:.3f}'.format(similarity))
    return similarity

def set_similarity(data1, data2, Print=False):
    # 자카드 유사도를 구합니다.
    union = set(tokenized_doc1).union(set(tokenized_doc2))
    intersection = set(tokenized_doc1).intersection(set(tokenized_doc2))
    similarity = len(intersection)/len(union)
    if (Print):
        print(similarity)
    return similarity

def eucli_similarity(data1, data2, Print=False):
    # 유클리디언 유사도를 구합니다.
    similarity = euclidean_distances(data1, data2)
    if (Print):
        print('data 1, data 2 Euclidean 유사도: {0:.3f}'.format(similarity))
    return similarity

def manhattan_similarity(data1, data2, Print=False):
    # 맨해튼 유사도를 구합니다.
    norm_data1 = __normalize(data1)
    norm_data2 = __normalize(data2)
    similarity = manhattan_distances(norm_data1, norm_data2)
    if (Print):
        print('data 1, data 2 Manhattan 유사도: {0:.3f}'.format(similarity))
# region end 유사도 분석        


# 특정 벡터를 정규화합니다.
# 본 프로젝트에서는 유사도 분석시의 결과를 0~1의 범위로 제한시키기 위해 tfidf결과값에 정규화를 취해준뒤 유사도를 분석합니다.
def __normalize(v):
    norm = np.sum(v)
    return v / norm 

# tfidf를 이용하여 본프로젝트의 DB속 판례 데이터와 input으로 받은 data의 유사도를 전체적으로 분석하여 가장 높은 유사도를 보이는 top10을 골라줍니다.
def top10(data, method, Print=False):
    # DB에서 받아와야됨
    # 각각 판례의 tfidf분석결과의 리스트가 각각의 인덱스에 들어가므로 결론적으로 2차원 배열이 된다.
    case_data_metrics = []
    # case_data_metrics.append(DB_data) 

    similarity = 0
    if (method == 'set'):
        similarity = set_similarity(case_data_metrics, data, Print)
    elif (methoc == 'eucli'):
        similarity = eucli_similarity(case_data_metrics, data, Print)
    elif (methoc == 'manhattan'):
        similarity = manhattan_similarity(case_data_metrics, data, Print)
    elif (methoc == 'cos'):
        similarity = cos_similarity(case_data_metrics, data, Print)

    # Todo