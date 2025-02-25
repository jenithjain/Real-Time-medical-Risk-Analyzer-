# MediRisk AI 🩺⚡  
**Real-Time Medical Risk Assessment & Adaptive Questionnaire System**  

---



## 📌 Overview  
**MediRisk AI** is an end-to-end system that processes medical responses in real-time, generates risk scores, adapts questionnaires dynamically,Mental health check up and creates actionable insurance reports. Designed for insurers and clinicians, it integrates medical guidelines and provides underwriters with intuitive risk insights.  

**Key Innovations**:  
- Real-time risk scoring with explainable AI.
- risk assesment report for the insurance company based on the user's data
- Reinforcement Learning (RL)-driven adaptive questioning.
- Mental Health check up and review.
- HIPAA-compliant underwriter dashboard.   

---

## 🚀 Features  
### **1. Conversational AI Bot**  
- **Dynamic Questioning**: Adapts follow-up questions using RL and decision trees.
- **Mental Health Score**: User is asked Pyscometric Questions and then scores and recommendations are assigned  on his mental health.
- **Live Risk Meter**: Visualizes risk score evolution during the chat.  
- **Data Extraction from Report**: extract the body report which is uploaded by user and helps to make questions on it. 

### **2. Real-Time Risk Engine**  
- **Models**: XGBoost (structured data), BioBERT (NLP), Survival Analysis (long-term risk).  
- **Guideline Compliance**: Flags deviations from CDC/WHO/ACC-AHA rules.  

### **3. Underwriter Dashboard**  
- **Risk Heatmaps**: Geographic distribution of high-risk cases.  
- **Audit Trails**: Track AI decisions vs. human overrides.  
- **Automated Reports**: One-click PDF/Excel generation.  
---

## 🛠️ Technical Architecture  
### **System Components**  
1. **Backend**:  
   - **Real-Time API**: FastAPI/Node.js for EHR/wearable integration.  
   - **ML Models**: XGBoost for risk prediction, Hugging Face for NLP.  
   - **Database**: PostgreSQL (structured), Elasticsearch (text), Neo4j (knowledge graphs).  

2. **Frontend**:  
   - **Chat Interface**: React.js + express.js .  
   - **Dashboard**: Plotly/Dash for visualizations.  

3. **Deployment**:  
   - **Cloud**: AWS/Azure (HIPAA-compliant buckets).  
   - **DevOps**: Kubernetes, GitHub Actions CI/CD.  

### **Key Dependencies**  
```plaintext
- Python 3.9+
- PyTorch, Transformers, XGBoost
- React.js, D3.js, Plotly
- PostgreSQL, Elasticsearch
