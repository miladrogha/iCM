import pandas as pd
from sklearn.metrics import accuracy_score, confusion_matrix, precision_score, recall_score, f1_score

#  Read CSV file and convert to dataFrame
def read_csv_data(file):
    df = pd.read_csv(file)
    return df

# Pconvert sting array to scalar array:
def convert_to_scalar(col, positive=None):
    new_col = col.apply(lambda x:1 if x==positive else 0)
    return new_col
 
# Provide Metrics
def eval_metrics(y_true, y_pred):
    acc = accuracy_score(y_true=y_true, y_pred=y_pred)
    prec = precision_score(y_true=y_true , y_pred=y_pred)
    recall = recall_score(y_true=y_true , y_pred=y_pred)
    f1 = f1_score(y_true=y_true , y_pred=y_pred)

    return {
        'accuracy': acc,
        'precision': prec,
        'f1': f1,
        'recall': recall
        }








if __name__ == '__main__':
    print('util functs!')