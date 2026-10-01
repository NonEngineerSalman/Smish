import re

def check_indicators(text: str) -> dict:
    indicators = []
    
    # 1. Suspicious URL Check
    url_pattern = re.compile(r'(http|https|www\.|bit\.ly|cutt\.ly|tinyurl\.com|\.com|\.org|\.net|\.bd)', re.IGNORECASE)
    if url_pattern.search(text):
        indicators.append("⚠ Suspicious URL / Link detected")
        
    # 2. Urgency language
    urgency_keywords = ['জরুরি', 'তাড়াতাড়ি', 'সতর্কতা', 'বাতিল', 'suspension', 'urgent', 'warning', 'verify', 'update', 'account closed', 'block']
    if any(keyword in text.lower() for keyword in urgency_keywords):
        indicators.append("⚠ Urgency language detected")
        
    # 3. Financial indicators
    financial_keywords = ['টাকা', 'ব্যাংক', 'বিকাশ', 'নগদ', 'রকেট', 'পেমেন্ট', 'payment', 'account', 'bank', 'card', 'transaction', 'pin', 'otp', 'লটারি', 'পুরস্কার', 'win']
    if any(keyword in text.lower() for keyword in financial_keywords):
        indicators.append("⚠ Financial terminology detected")
        
    return {
        "indicators": indicators,
        "has_url": bool(url_pattern.search(text)),
        "has_urgency": any(keyword in text.lower() for keyword in urgency_keywords),
        "has_financial": any(keyword in text.lower() for keyword in financial_keywords)
    }
