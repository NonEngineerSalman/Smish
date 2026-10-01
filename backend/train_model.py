import os
import json
import joblib
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.naive_bayes import MultinomialNB
from sklearn.neighbors import KNeighborsClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import (accuracy_score, precision_score, recall_score,
                             f1_score, confusion_matrix, roc_auc_score, roc_curve)
from sklearn.preprocessing import label_binarize

from preprocessing import preprocess_dataframe


def train_and_evaluate():
    dataset_path = os.path.join("dataset", "dataset.csv")
    if not os.path.exists(dataset_path):
        raise FileNotFoundError(f"Dataset not found at {dataset_path}")

    df = pd.read_csv(dataset_path, encoding='utf-8')
    text_col = 'text'
    label_col = 'label'

    df = preprocess_dataframe(df, text_col, label_col)

    total_messages = len(df)
    class_counts = df[label_col].value_counts().to_dict()
    df['text_len'] = df[text_col].apply(lambda x: len(str(x)))
    df['word_count'] = df[text_col].apply(lambda x: len(str(x).split()))

    dataset_stats = {
        "total_messages": total_messages,
        "class_counts": class_counts,
        "avg_length": float(df['text_len'].mean()),
        "avg_word_count": float(df['word_count'].mean())
    }

    X = df['cleaned_text']
    y = df[label_col]
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y)

    vectorizer = TfidfVectorizer(ngram_range=(1, 2), max_features=5000)
    X_train_vec = vectorizer.fit_transform(X_train)
    X_test_vec = vectorizer.transform(X_test)

    models = {
        "logistic": LogisticRegression(max_iter=1000, random_state=42),
        "naive_bayes": MultinomialNB(),
        "knn": KNeighborsClassifier(n_neighbors=5),
        "random_forest": RandomForestClassifier(n_estimators=100, random_state=42),
        "decision_tree": DecisionTreeClassifier(random_state=42)
    }

    metrics = {}
    best_model_name = "logistic"
    best_f1 = 0

    for name, model in models.items():
        model.fit(X_train_vec, y_train)
        y_pred = model.predict(X_test_vec)

        acc = accuracy_score(y_test, y_pred)
        prec = precision_score(y_test, y_pred, average='weighted', zero_division=0)
        rec = recall_score(y_test, y_pred, average='weighted', zero_division=0)
        f1 = f1_score(y_test, y_pred, average='weighted', zero_division=0)
        cm = confusion_matrix(y_test, y_pred, labels=list(model.classes_))

        # ROC AUC (weighted OvR)
        try:
            y_proba = model.predict_proba(X_test_vec)
            auc = roc_auc_score(y_test, y_proba, multi_class='ovr', average='weighted')
        except Exception:
            y_proba = None
            auc = 0.0

        # Per-class ROC curve data
        roc_data = {}
        if y_proba is not None:
            y_test_bin = label_binarize(y_test, classes=list(model.classes_))
            for i, cls in enumerate(model.classes_):
                try:
                    fpr_arr, tpr_arr, _ = roc_curve(y_test_bin[:, i], y_proba[:, i])
                    roc_data[cls] = {
                        "fpr": fpr_arr.tolist(),
                        "tpr": tpr_arr.tolist()
                    }
                except Exception:
                    roc_data[cls] = {"fpr": [], "tpr": []}

        metrics[name] = {
            "accuracy": acc,
            "precision": prec,
            "recall": rec,
            "f1": f1,
            "roc_auc": auc,
            "roc_curve": roc_data,
            "confusion_matrix": cm.tolist(),
            "classes": list(model.classes_)
        }

        if f1 > best_f1:
            best_f1 = f1
            best_model_name = name

        joblib.dump(model, os.path.join("models", f"{name}_model.pkl"))

    joblib.dump(vectorizer, os.path.join("models", "tfidf_vectorizer.pkl"))

    metadata = {
        "dataset_stats": dataset_stats,
        "metrics": metrics,
        "best_model": best_model_name,
        "test_size": len(X_test),
        "train_size": len(X_train)
    }
    with open(os.path.join("models", "metadata.json"), "w", encoding='utf-8') as f:
        json.dump(metadata, f, ensure_ascii=False, indent=4)

    return metadata


if __name__ == "__main__":
    if not os.path.exists("models"):
        os.makedirs("models")
    print("Training models...")
    train_and_evaluate()
    print("Training completed successfully.")
