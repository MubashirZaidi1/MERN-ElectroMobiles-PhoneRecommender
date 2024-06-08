import sys
import pandas as pd
import pickle
import string
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def clean_mobile_phone_name(name):
    """Clean phone name by removing special characters and extra spaces."""
    name = ''.join(char for char in name if char in string.ascii_letters + string.digits + ' ')
    return name.strip()

# Load processed corpus and cleaned phone names
df_processed = pd.read_csv('processed_corpus.csv')

# Parse arguments from command line
if len(sys.argv) < 3:
    print("Usage: python recommend_phones.py <favorite_company> <favorite_model>")
    sys.exit(1)

favorite_company = sys.argv[1].lower()
favorite_model = sys.argv[2].lower()

# Filter based on user preferences
selected_phone = df_processed[(df_processed['name'].str.lower().str.contains(favorite_company)) & 
                              (df_processed['name'].str.lower().str.contains(favorite_model))]

if len(selected_phone) == 0:
    print(f"No matching phone found for company '{favorite_company}' and model '{favorite_model}'.")
    sys.exit(1)

# Prepare corpus for TF-IDF vectorization
corpus = df_processed['processed_corpus'].values.astype('U')  # Convert to Unicode strings

# Initialize TF-IDF vectorizer
tfidf_vectorizer = TfidfVectorizer()
tfidf_matrix = tfidf_vectorizer.fit_transform(corpus)

# Transform selected phone's corpus using the TF-IDF vectorizer
selected_corpus = selected_phone['processed_corpus'].iloc[0]
selected_tfidf = tfidf_vectorizer.transform([selected_corpus])

# Calculate cosine similarity with all phones in the corpus
similarities = cosine_similarity(selected_tfidf, tfidf_matrix)

# Create DataFrame with similarities and phone names
similarities_df = pd.DataFrame(similarities.T, columns=['similarity'])
similarities_df['name'] = df_processed['name']

# Sort by similarity (highest first) and exclude the selected phone itself
similarities_df = similarities_df.sort_values(by='similarity', ascending=False)
top_recommendations = similarities_df[similarities_df['name'] != selected_phone['name'].iloc[0]].head(3)

# Prepare output as newline-delimited text
output = '\n'.join(clean_mobile_phone_name(name) for name in top_recommendations['name'])

# Print output (newline-delimited list of cleaned phone names)
print(output)
